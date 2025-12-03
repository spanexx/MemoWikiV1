export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'ollama' | 'mock';
export type ProviderStatus = 'connected' | 'error' | 'unconfigured';
export type ConfigSource = 'env' | 'dashboard';

export interface LLMProviderConfig {
    name: LLMProvider;
    configured: boolean;
    status: ProviderStatus;
    model?: string;
    latency?: number;
    usage?: {
        requests: number;
        estimatedCost: number;
        cacheHitRate: number;
    };
}

export interface LLMConfig {
    source: ConfigSource;
    currentProvider: LLMProvider;
    providers: LLMProviderConfig[];
}

export interface LLMConfigUpdate {
    source?: ConfigSource;
    provider?: LLMProvider;
    apiKey?: string;
    model?: string;
    baseUrl?: string;
    [key: string]: any; // Allow provider-specific config like { openai: { apiKey, model } }
    options?: {
        maxRetries?: number;
        timeout?: number;
        temperature?: number;
    };
}

export interface LLMTestResponse {
    success: boolean;
    latency?: number;
    error?: string;
}

export interface LLMModel {
    id: string;
    name: string;
    description: string;
    pricing?: string;
    contextWindow?: number;
}
