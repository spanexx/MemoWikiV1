import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './base';
import { CodeStructure, GitState } from '../../types';
import { config } from '../../config/config';

export class AnthropicProvider extends BaseProvider {
    private client: Anthropic;
    private model: string;

    constructor(apiKey?: string, model?: string) {
        super();
        this.client = new Anthropic({
            apiKey: apiKey || config.anthropicApiKey,
        });
        this.model = model || config.anthropicModel;
    }

    async generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string> {
        const prompt = this.buildDocumentationPrompt(code, gitState);

        return this.retryWithBackoff(async () => {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 2048,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                system: 'You are a technical documentation expert. Generate clear, concise markdown documentation.',
            });

            const content = response.content[0];
            return content.type === 'text' ? content.text : '';
        });
    }

    async generateDiagram(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 2048,
                messages: [
                    {
                        role: 'user',
                        content: this.buildDiagramPrompt(code),
                    },
                ],
            });

            const content = response.content[0];
            return content.type === 'text' ? content.text : '```mermaid\nclassDiagram\n```';
        });
    }

    async generateFlow(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 2048,
                messages: [
                    {
                        role: 'user',
                        content: this.buildFlowPrompt(code),
                    },
                ],
            });

            const content = response.content[0];
            return content.type === 'text' ? content.text : '```mermaid\\nflowchart TD\\n```';
        });
    }

    async generateSummary(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 2048,
                messages: [
                    {
                        role: 'user',
                        content: this.buildSummaryPrompt(files, gitState),
                    },
                ],
            });

            const content = response.content[0];
            return content.type === 'text' ? content.text : '# Project Summary\\n\\nNo summary available.';
        });
    }
    async generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 2048,
                messages: [
                    {
                        role: 'user',
                        content: this.buildArchitectureDiagramPrompt(files, gitState),
                    },
                ],
            });

            const content = response.content[0];
            return content.type === 'text' ? content.text : '```mermaid\nflowchart LR\n```';
        });
    }

    async generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 2048,
                messages: [
                    {
                        role: 'user',
                        content: this.buildAgentSummaryPrompt(files, type, analysis),
                    },
                ],
            });

            const content = response.content[0];
            return content.type === 'text' ? content.text : '# Agent Summary\n\nNo summary available.';
        });
    }
}
