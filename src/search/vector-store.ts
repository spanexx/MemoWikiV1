import { ChromaClient, Collection } from 'chromadb';
import { config } from '../config/config';

export interface SearchResult {
    id: string;
    content: string;
    metadata: Record<string, any>;
    similarity: number;
}

export class VectorStore {
    private client: ChromaClient;
    private collectionName: string = 'memowiki_code';

    constructor() {
        this.client = new ChromaClient({
            path: config.chromaUrl || 'http://localhost:8000',
        });
    }

    async initialize(): Promise<void> {
        try {
            await this.getOrCreateCollection();
        } catch (error) {
            console.error('Failed to initialize vector store:', error);
            throw error;
        }
    }

    private async getOrCreateCollection(): Promise<Collection> {
        try {
            return await this.client.getOrCreateCollection({
                name: this.collectionName,
                metadata: { description: 'MemoWiki code embeddings' },
            });
        } catch (error) {
            console.error('Failed to get or create collection:', error);
            throw error;
        }
    }

    async addEmbedding(
        id: string,
        embedding: number[],
        content: string,
        metadata: Record<string, any> = {}
    ): Promise<void> {
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
        await this.client.deleteCollection({ name: this.collectionName });
    }
}
