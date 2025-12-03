import axios from 'axios';
import { BaseProvider } from './base';
import { CodeStructure, GitState } from '../../types';
import { config } from '../../config/config';

export class OllamaProvider extends BaseProvider {
    private baseUrl: string;
    private model: string;

    constructor(baseUrl?: string, model?: string) {
        super();
        this.baseUrl = baseUrl || config.ollamaBaseUrl;
        this.model = model || config.ollamaModel;
    }

    async generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: this.buildDocumentationPrompt(code, gitState),
                stream: false,
            });

            return response.data.response || '';
        });
    }

    async generateDiagram(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: this.buildDiagramPrompt(code),
                stream: false,
            });

            return response.data.response || '```mermaid\nclassDiagram\n```';
        });
    }

    async generateFlow(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: this.buildFlowPrompt(code),
                stream: false,
            });

            return response.data.response || '```mermaid\nflowchart TD\n```';
        });
    }

    async generateSummary(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: this.buildSummaryPrompt(files, gitState),
                stream: false,
            });

            return response.data.response || '# Project Summary\n\nNo summary available.';
        });
    }
    async generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: this.buildArchitectureDiagramPrompt(files, gitState),
                stream: false,
            });

            return response.data.response || '```mermaid\nflowchart LR\n```';
        });
    }

    async generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: this.buildAgentSummaryPrompt(files, type, analysis),
                stream: false,
            });

            return response.data.response || '# Agent Summary\n\nNo summary available.';
        });
    }
}
