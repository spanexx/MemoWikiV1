import OpenAI from 'openai';
import { BaseProvider } from './base';
import { CodeStructure, GitState } from '../../types';
import { config } from '../../config/config';

export class OpenAIProvider extends BaseProvider {
    private client: OpenAI;
    private model: string;

    constructor(apiKey?: string, model?: string) {
        super();
        this.client = new OpenAI({
            apiKey: apiKey || config.openaiApiKey,
        });
        this.model = model || config.openaiModel;
    }

    async generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string> {
        const prompt = this.buildDocumentationPrompt(code, gitState);

        return this.retryWithBackoff(async () => {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a technical documentation expert. Generate clear, concise markdown documentation.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.3,
            });

            return response.choices[0]?.message?.content || '';
        });
    }

    async generateDiagram(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'user',
                        content: this.buildDiagramPrompt(code),
                    },
                ],
            });

            return response.choices[0]?.message?.content || '```mermaid\nclassDiagram\n```';
        });
    }

    async generateFlow(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'user',
                        content: this.buildFlowPrompt(code),
                    },
                ],
            });

            return response.choices[0]?.message?.content || '```mermaid\nflowchart TD\n```';
        });
    }

    async generateSummary(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: this.buildSummaryPrompt(files, gitState) }],
            });
            return response.choices[0]?.message?.content || '# Project Summary\n\nNo summary available.';
        });
    }

    async generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: this.buildArchitectureDiagramPrompt(files, gitState) }],
            });
            return response.choices[0]?.message?.content || '```mermaid\nflowchart LR\n```';
        });
    }

    async generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: this.buildAgentSummaryPrompt(files, type, analysis) }],
            });
            return response.choices[0]?.message?.content || '# Agent Summary\n\nNo summary available.';
        });
    }
}
