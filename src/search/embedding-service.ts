import OpenAI from 'openai';
import { config } from '../config/config';

export interface EmbeddingProvider {
    generateEmbedding(text: string): Promise<number[]>;
    generateEmbeddings(texts: string[]): Promise<number[][]>;
}

export class OpenAIEmbeddingService implements EmbeddingProvider {
    private client: OpenAI;
    private model: string = 'text-embedding-3-small';

    constructor() {
        this.client = new OpenAI({
            apiKey: config.openaiApiKey || '',
        });
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const response = await this.client.embeddings.create({
            model: this.model,
            input: text,
        });

        return response.data[0].embedding;
    }

    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        const response = await this.client.embeddings.create({
            model: this.model,
            input: texts,
        });

        return response.data.map(item => item.embedding);
    }

    // Chunk large text into smaller pieces for embedding
    chunkText(text: string, maxTokens: number = 8000): string[] {
        // Simple chunking by character count (rough estimate: 1 token ≈ 4 chars)
        const maxChars = maxTokens * 4;
        const chunks: string[] = [];

        for (let i = 0; i < text.length; i += maxChars) {
            chunks.push(text.slice(i, i + maxChars));
        }

        return chunks;
    }
}
