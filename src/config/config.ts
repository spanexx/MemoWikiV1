import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

// Provider type
export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'ollama' | 'mock';

// Configuration schema
const configSchema = z.object({
    provider: z.enum(['openai', 'anthropic', 'gemini', 'openrouter', 'ollama', 'mock']).default('mock'),

    // OpenAI
    openaiApiKey: z.string().optional(),
    openaiModel: z.string().default('gpt-4-turbo-preview'),

    // Anthropic
    anthropicApiKey: z.string().optional(),
    anthropicModel: z.string().default('claude-3-5-sonnet-20241022'),

    // Gemini
    geminiApiKey: z.string().optional(),
    geminiModel: z.string().default('gemini-1.5-pro'),

    // OpenRouter
    openrouterApiKey: z.string().optional(),
    openrouterModel: z.string().default('anthropic/claude-3.5-sonnet'),

    // Ollama
    ollamaBaseUrl: z.string().default('http://localhost:11434'),
    ollamaModel: z.string().default('llama2'),

    // ChromaDB Configuration
    chromaUrl: z.string().default('http://localhost:8000'),
    enableSemanticSearch: z.boolean().default(false),

    // Retry configuration
    maxRetries: z.number().default(3),
    retryDelay: z.number().default(1000),
});

export type Config = z.infer<typeof configSchema>;

export class ConfigManager {
    private config: Config;

    constructor(initialConfig?: Partial<Config>) {
        this.config = configSchema.parse({
            ...this.loadFromEnv(),
            ...initialConfig,
        });
        this.validateConfig();
    }

    private loadFromEnv(): Partial<Config> {
        return {
            provider: (process.env.LLM_PROVIDER as LLMProvider) || 'mock',

            openaiApiKey: process.env.OPENAI_API_KEY,
            openaiModel: process.env.OPENAI_MODEL,

            anthropicApiKey: process.env.ANTHROPIC_API_KEY,
            anthropicModel: process.env.ANTHROPIC_MODEL,

            geminiApiKey: process.env.GEMINI_API_KEY,
            geminiModel: process.env.GEMINI_MODEL,

            openrouterApiKey: process.env.OPENROUTER_API_KEY,
            openrouterModel: process.env.OPENROUTER_MODEL,

            ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
            ollamaModel: process.env.OLLAMA_MODEL,

            chromaUrl: process.env.CHROMA_URL,
            enableSemanticSearch: process.env.ENABLE_SEMANTIC_SEARCH === 'true',

            maxRetries: process.env.MAX_RETRIES ? parseInt(process.env.MAX_RETRIES) : undefined,
            retryDelay: process.env.RETRY_DELAY ? parseInt(process.env.RETRY_DELAY) : undefined,
        };
    }

    private validateConfig(): void {
        if (this.config.provider === 'openai' && !this.config.openaiApiKey) {
            throw new Error('OPENAI_API_KEY is required when using OpenAI provider');
        }
        if (this.config.provider === 'anthropic' && !this.config.anthropicApiKey) {
            throw new Error('ANTHROPIC_API_KEY is required when using Anthropic provider');
        }
        if (this.config.provider === 'gemini' && !this.config.geminiApiKey) {
            throw new Error('GEMINI_API_KEY is required when using Gemini provider');
        }
        if (this.config.provider === 'openrouter' && !this.config.openrouterApiKey) {
            throw new Error('OPENROUTER_API_KEY is required when using OpenRouter provider');
        }
    }

    public getConfig(): Config {
        return this.config;
    }
}

export const configManager = new ConfigManager();
export const config = configManager.getConfig();
