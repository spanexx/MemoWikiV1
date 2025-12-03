import { ChromaClient, Collection } from 'chromadb';
import { config } from '../config/config';
import { URL } from 'url';

export interface SearchResult {
    id: string;
    content: string;
    metadata: Record<string, any>;
    similarity: number;
}

export class VectorStore {
    private client: ChromaClient;
    private collectionName: string = 'memowiki_code';
    private _isAvailable: boolean = false;
    private collectionPromise?: Promise<Collection>;

    constructor() {
        const chromaUrl = new URL(config.chromaUrl || 'http://localhost:8000');
        const host = chromaUrl.hostname;
        const port = parseInt(chromaUrl.port);
        const ssl = chromaUrl.protocol === 'https:';

        console.log(`[LOG] VectorStore: Connecting to ChromaDB with Host: ${host}, Port: ${port}, SSL: ${ssl}`);

        this.client = new ChromaClient({
            host,
            port,
            ssl,
        });
    }

    public get isAvailable(): boolean {
        return this._isAvailable;
    }

    async initialize(): Promise<void> {
        console.log('[LOG] VectorStore: Initializing ChromaDB connection...');
        try {
            await this.getOrCreateCollection();
            this._isAvailable = true;
            console.log('[LOG] VectorStore: ChromaDB connection successful.');
        } catch (error) {
            console.warn('[WARN] VectorStore: Failed to connect to ChromaDB. Semantic search will be disabled. Full error:', error);
            this._isAvailable = false;
            // Do not re-throw, allow server to start without semantic search
        }
    }

    private async getOrCreateCollection(): Promise<Collection> {
        if (this.collectionPromise) return this.collectionPromise;
        try {
            // Provide a stub embedding function so Chroma does not attempt to use the default-embed package
            const externalEF = {
                name: 'external-embeddings',
                generate: async (_texts: string[]): Promise<number[][]> => {
                    throw new Error('Embeddings must be provided explicitly by the client.');
                },
                generateForQueries: async (_texts: string[]): Promise<number[][]> => {
                    throw new Error('Query embeddings must be provided explicitly by the client.');
                },
            };

            this.collectionPromise = this.client.getOrCreateCollection({
                name: this.collectionName,
                metadata: { description: 'MemoWiki code embeddings' },
                embeddingFunction: externalEF as any,
            });
            return await this.collectionPromise;
        } catch (error) {
            // This catch is mainly for internal errors if ChromaDB becomes unavailable mid-operation
            console.error('[ERROR] VectorStore: Failed to get or create collection during operation:', (error as Error).message);
            // reset promise so subsequent attempts can retry
            this.collectionPromise = undefined;
            throw error;
        }
    }

    async addEmbedding(
        id: string,
        embedding: number[],
        content: string,
        metadata: Record<string, any> = {}
    ): Promise<void> {
        if (!this._isAvailable) {
            console.warn('[WARN] VectorStore: Attempted to add embedding when ChromaDB is unavailable.');
            return;
        }
        const collection = await this.getOrCreateCollection();

        await collection.add({
            ids: [id],
            embeddings: [embedding],
            documents: [content],
            metadatas: [metadata],
        });
    }

    async addEmbeddings(
        ids: string[],
        embeddings: number[][],
        contents: string[],
        metadatas: Record<string, any>[] = []
    ): Promise<void> {
        if (!this._isAvailable) {
            console.warn('[WARN] VectorStore: Attempted to add embeddings when ChromaDB is unavailable.');
            return;
        }
        const collection = await this.getOrCreateCollection();

        await collection.add({
            ids,
            embeddings,
            documents: contents,
            metadatas: metadatas.length > 0 ? metadatas : undefined,
        });
    }

    async search(
        queryEmbedding: number[],
        limit: number = 10
    ): Promise<SearchResult[]> {
        if (!this._isAvailable) {
            console.warn('[WARN] VectorStore: Attempted semantic search when ChromaDB is unavailable. Returning empty results.');
            return [];
        }
        const collection = await this.getOrCreateCollection();

        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: limit,
        });

        const searchResults: SearchResult[] = [];

        if (results.ids && results.ids[0]) {
            for (let i = 0; i < results.ids[0].length; i++) {
                const distance = results.distances?.[0]?.[i];
                searchResults.push({
                    id: results.ids[0][i],
                    content: results.documents?.[0]?.[i] || '',
                    metadata: results.metadatas?.[0]?.[i] || {},
                    similarity: distance !== undefined && distance !== null ? 1 - distance : 0,
                });
            }
        }

        return searchResults;
    }

    async deleteCollection(): Promise<void> {
        if (!this._isAvailable) {
            console.warn('[WARN] VectorStore: Attempted to delete collection when ChromaDB is unavailable.');
            return;
        }
        await this.client.deleteCollection({ name: this.collectionName });
    }
}
