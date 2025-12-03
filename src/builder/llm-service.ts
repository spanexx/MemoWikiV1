import { LLMProvider } from './providers/base';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { GeminiProvider } from './providers/gemini';
import { OpenRouterProvider } from './providers/openrouter';
import { OllamaProvider } from './providers/ollama';
import { MockProvider } from './providers/mock';
import { Config } from '../config/config';
import { CodeStructure, GitState } from '../types';
import chalk from 'chalk';

export class LLMService {
    private provider: LLMProvider;
    private config: Config;

    constructor(config: Config) {
        this.config = config;
        this.provider = this.createProvider(config);
    }

    private createProvider(config: Config): LLMProvider {
        switch (config.provider) {
            case 'openai':
                return new OpenAIProvider(config.openaiApiKey, config.openaiModel);
            case 'anthropic':
                return new AnthropicProvider(config.anthropicApiKey, config.anthropicModel);
            case 'gemini':
                return new GeminiProvider(config.geminiApiKey, config.geminiModel);
            case 'openrouter':
                return new OpenRouterProvider(config.openrouterApiKey, config.openrouterModel);
            case 'ollama':
                return new OllamaProvider(config.ollamaBaseUrl || 'http://localhost:11434', config.ollamaModel);
            case 'mock':
                return new MockProvider();
            default:
                throw new Error(`Unknown provider: ${config.provider}`);
        }
    }

    private getModelName(): string {
        switch (this.config.provider) {
            case 'openai': return this.config.openaiModel;
            case 'anthropic': return this.config.anthropicModel;
            case 'gemini': return this.config.geminiModel;
            case 'openrouter': return this.config.openrouterModel;
            case 'ollama': return this.config.ollamaModel;
            default: return 'mock-model';
        }
    }

    private logGeneration(type: string) {
        console.log(chalk.gray(`   🤖 [${this.config.provider}:${this.getModelName()}] Generating ${type}...`));
    }

    async generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string> {
        this.logGeneration('documentation');
        return this.provider.generateDocumentation(code, gitState);
    }

    async generateDiagram(code: any): Promise<string> {
        this.logGeneration('diagram');
        return this.provider.generateDiagram(code);
    }

    async generateSummary(files: CodeStructure[], gitState: GitState): Promise<string> {
        this.logGeneration('project summary');
        return this.provider.generateSummary(files, gitState);
    }

    async generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string> {
        this.logGeneration('Architecture Diagram');
        return this.provider.generateArchitectureDiagram(files, gitState);
    }

    async generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string> {
        this.logGeneration('Agent Summary');
        return this.provider.generateAgentSummary(files, type, analysis);
    }
}
