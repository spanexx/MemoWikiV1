import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base';
import { CodeStructure, GitState } from '../../types';
import { config } from '../../config/config';

export class GeminiProvider extends BaseProvider {
    private genAI: GoogleGenerativeAI;
    private model: string;

    constructor(apiKey?: string, model?: string) {
        super();
        this.genAI = new GoogleGenerativeAI(apiKey || config.geminiApiKey || '');
        this.model = model || config.geminiModel;
    }

    async generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const result = await model.generateContent(this.buildDocumentationPrompt(code, gitState));
            return result.response.text();
        });
    }

    async generateDiagram(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const result = await model.generateContent(this.buildDiagramPrompt(code));
            return result.response.text() || '```mermaid\nclassDiagram\n```';
        });
    }

    async generateFlow(code: CodeStructure): Promise<string> {
        return this.retryWithBackoff(async () => {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const result = await model.generateContent(this.buildFlowPrompt(code));
            return result.response.text() || '```mermaid\nflowchart TD\n```';
        });
    }

    async generateSummary(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const result = await model.generateContent(this.buildSummaryPrompt(files, gitState));
            return result.response.text();
        });
    }

    async generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string> {
        return this.retryWithBackoff(async () => {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const result = await model.generateContent(this.buildArchitectureDiagramPrompt(files, gitState));
            return result.response.text() || '```mermaid\nflowchart LR\n```';
        });
    }

    async generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string> {
        return this.retryWithBackoff(async () => {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const result = await model.generateContent(this.buildAgentSummaryPrompt(files, type, analysis));
            return result.response.text();
        });
    }
}
