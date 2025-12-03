import { OpenAIEmbeddingService } from './embedding-service';
import { VectorStore, SearchResult } from './vector-store';
import { CodeStructure } from '../types';

export class SearchService {
    private embeddingService: OpenAIEmbeddingService;
    private vectorStore: VectorStore;

    constructor() {
        this.embeddingService = new OpenAIEmbeddingService();
        this.vectorStore = new VectorStore();
    }

    async initialize(): Promise<void> {
        await this.vectorStore.initialize();
    }

    async indexCode(code: CodeStructure, documentation: string): Promise<void> {
        const embeddings: number[][] = [];
        const ids: string[] = [];
        const contents: string[] = [];
        const metadatas: Record<string, any>[] = [];

        // Index the file documentation
        const docEmbedding = await this.embeddingService.generateEmbedding(documentation);
        ids.push(`file:${code.file}`);
        embeddings.push(docEmbedding);
        contents.push(documentation);
        metadatas.push({ type: 'file', file: code.file });

        // Index each class
        for (const cls of code.classes) {
            const classText = `Class ${cls.name}: methods [${cls.methods.join(', ')}], properties [${cls.properties.join(', ')}]`;
            const classEmbedding = await this.embeddingService.generateEmbedding(classText);

            ids.push(`class:${code.file}:${cls.name}`);
            embeddings.push(classEmbedding);
            contents.push(classText);
            metadatas.push({
                type: 'class',
                file: code.file,
                name: cls.name,
                methods: cls.methods,
            });
        }

        // Index each function
        for (const func of code.functions) {
            const funcText = `Function ${func.name}`;
            const funcEmbedding = await this.embeddingService.generateEmbedding(funcText);

            ids.push(`function:${code.file}:${func.name}`);
            embeddings.push(funcEmbedding);
            contents.push(funcText);
            metadatas.push({
                type: 'function',
                file: code.file,
                name: func.name,
            });
        }

        if (ids.length > 0) {
            await this.vectorStore.addEmbeddings(ids, embeddings, contents, metadatas);
        }
    }

    async search(query: string, limit: number = 10): Promise<SearchResult[]> {
        const queryEmbedding = await this.embeddingService.generateEmbedding(query);
        return await this.vectorStore.search(queryEmbedding, limit);
    }

    async reset(): Promise<void> {
        await this.vectorStore.deleteCollection();
        await this.vectorStore.initialize();
    }
}
