"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
/**
 * Service class for interacting with LLM providers
 * Currently supports mock provider with plans for OpenAI, Anthropic, and Gemini
 */
class LLMService {
    apiKey;
    provider;
    /**
     * Creates a new LLMService instance
     * @param apiKey - The API key for the LLM provider
     * @param provider - The LLM provider to use (defaults to 'mock')
     */
    constructor(apiKey, provider = 'mock') {
        this.apiKey = apiKey;
        this.provider = provider;
    }
    /**
     * Generates documentation for a code structure based on git state
     * @param code - The code structure to document
     * @param gitState - The current git state
     * @returns A promise that resolves to the generated documentation
     */
    async generateDocumentation(code, gitState) {
        if (this.provider === 'mock') {
            return this.mockDocumentation(code, gitState);
        }
        // TODO: Implement actual LLM calls here
        throw new Error(`Provider ${this.provider} not implemented yet.`);
    }
    /**
     * Generates a diagram representation of a code structure
     * @param code - The code structure to diagram
     * @returns A promise that resolves to the generated diagram
     */
    async generateDiagram(code) {
        if (this.provider === 'mock') {
            return this.mockDiagram(code);
        }
        // TODO: Implement actual LLM calls here
        throw new Error(`Provider ${this.provider} not implemented yet.`);
    }
    /**
     * Generates mock documentation for a code structure
     * Used when the provider is set to 'mock'
     * @param code - The code structure to document
     * @param gitState - The current git state
     * @returns The generated documentation as a string
     * @private
     */
    mockDocumentation(code, gitState) {
        return `
# Documentation for ${code.file}

## Overview
This file contains ${code.classes.length} classes and ${code.functions.length} functions.

## Classes
${code.classes.map(c => `- **${c.name}**: ${c.methods.length} methods`).join('\n')}

## Recent Changes
${gitState.recentCommit ? `Last commit: ${gitState.recentCommit.message} by ${gitState.recentCommit.author_name}` : 'No recent changes detected.'}
    `;
    }
    /**
     * Generates a mock diagram for a code structure
     * Used when the provider is set to 'mock'
     * @param code - The code structure to diagram
     * @returns The generated diagram as a string
     * @private
     */
    mockDiagram(code) {
        return `
\`\`\`mermaid
classDiagram
${code.classes.map(c => `    class ${c.name} {\n${c.methods.map(m => `        +${m}()`).join('\n')}\n    }`).join('\n')}
\`\`\`
    `;
    }
}
exports.LLMService = LLMService;
