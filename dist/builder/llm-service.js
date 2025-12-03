"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const openai_1 = require("./providers/openai");
const anthropic_1 = require("./providers/anthropic");
const gemini_1 = require("./providers/gemini");
const openrouter_1 = require("./providers/openrouter");
const ollama_1 = require("./providers/ollama");
const mock_1 = require("./providers/mock");
const chalk_1 = __importDefault(require("chalk"));
class LLMService {
    provider;
    config;
    constructor(config) {
        this.config = config;
        this.provider = this.createProvider(config);
    }
    createProvider(config) {
        switch (config.provider) {
            case 'openai':
                return new openai_1.OpenAIProvider(config.openaiApiKey, config.openaiModel);
            case 'anthropic':
                return new anthropic_1.AnthropicProvider(config.anthropicApiKey, config.anthropicModel);
            case 'gemini':
                return new gemini_1.GeminiProvider(config.geminiApiKey, config.geminiModel);
            case 'openrouter':
                return new openrouter_1.OpenRouterProvider(config.openrouterApiKey, config.openrouterModel);
            case 'ollama':
                return new ollama_1.OllamaProvider(config.ollamaBaseUrl || 'http://localhost:11434', config.ollamaModel);
            case 'mock':
                return new mock_1.MockProvider();
            default:
                throw new Error(`Unknown provider: ${config.provider}`);
        }
    }
    getModelName() {
        switch (this.config.provider) {
            case 'openai': return this.config.openaiModel;
            case 'anthropic': return this.config.anthropicModel;
            case 'gemini': return this.config.geminiModel;
            case 'openrouter': return this.config.openrouterModel;
            case 'ollama': return this.config.ollamaModel;
            default: return 'mock-model';
        }
    }
    logGeneration(type) {
        console.log(chalk_1.default.gray(`   🤖 [${this.config.provider}:${this.getModelName()}] Generating ${type}...`));
    }
    async generateDocumentation(code, gitState) {
        this.logGeneration('documentation');
        return this.provider.generateDocumentation(code, gitState);
    }
    async generateDiagram(code) {
        this.logGeneration('diagram');
        return this.provider.generateDiagram(code);
    }
    async generateSummary(files, gitState) {
        this.logGeneration('project summary');
        return this.provider.generateSummary(files, gitState);
    }
    async generateArchitectureDiagram(files, gitState) {
        this.logGeneration('Architecture Diagram');
        return this.provider.generateArchitectureDiagram(files, gitState);
    }
    async generateAgentSummary(files, type, analysis) {
        this.logGeneration('Agent Summary');
        return this.provider.generateAgentSummary(files, type, analysis);
    }
}
exports.LLMService = LLMService;
