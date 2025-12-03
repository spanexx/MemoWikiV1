import axios from 'axios';
import { BaseProvider } from './base';
import { CodeStructure, GitState } from '../../types';
import { config } from '../../config/config';

export class OpenRouterProvider extends BaseProvider {
    private apiKey: string;
    private model: string;
    private baseUrl: string = 'https://openrouter.ai/api/v1';

    constructor(apiKey?: string, model?: string) {
        super();
        this.apiKey = apiKey || config.openrouterApiKey || '';
        this.model = model || config.openrouterModel;
    }

    async generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: this.buildDocumentationPrompt(code, gitState),
                        },
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0]?.message?.content || '';
        });
    }

    async generateDiagram(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: this.buildDiagramPrompt(code),
                        },
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0]?.message?.content || '```mermaid\nclassDiagram\n```';
        });
    }

    async generateFlow(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: this.buildFlowPrompt(code),
                        },
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0]?.message?.content || '```mermaid\nflowchart TD\n```';
        });
    }

    async generateSummary(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: this.buildSummaryPrompt(files, gitState),
                        },
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0]?.message?.content || '# Project Summary\n\nNo summary available.';
        });
    }
    async generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: this.buildArchitectureDiagramPrompt(files, gitState),
                        },
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0]?.message?.content || '```mermaid\nflowchart LR\n```';
        });
    }

    async generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: this.buildAgentSummaryPrompt(files, type, analysis),
                        },
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0]?.message?.content || '# Agent Summary\n\nNo summary available.';
        });
    }
}
