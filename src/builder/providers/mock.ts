import { BaseProvider } from './base';
import { CodeStructure, GitState } from '../../types';

export class MockProvider extends BaseProvider {
    constructor(apiKey?: string, model?: string) {
        super();
    }
    async generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string> {
        return `
# Documentation for ${code.file}

## Overview
This file contains ${code.classes.length} classes and ${code.functions.length} functions.

## Classes
${code.classes.map(c => `- **${c.name}**: ${c.methods.length} methods`).join('\n')}

## Functions
${code.functions.map(f => `- **${f.name}**: ${f.parameters.join(', ')}`).join('\n')}

## Recent Changes
${gitState.recentCommit ? `Last commit: ${gitState.recentCommit.message} by ${gitState.recentCommit.author_name}` : 'No recent changes detected.'}
    `;
    }

    async generateDiagram(code: CodeStructure): Promise<string> {
        return `
\`\`\`mermaid
classDiagram
${code.classes.map(c => `    class ${c.name} {\n${c.methods.map(m => `        +${m}()`).join('\n')}\n    }`).join('\n')}
\`\`\`
    `;
    }

    async generateFlow(code: CodeStructure): Promise<string> {
        return '```mermaid\nflowchart TD\n    A[Start] --> B[End]\n```';
    }

    async generateSummary(files: CodeStructure[], gitState: GitState): Promise<string> {
        return '# Project Summary\n\nMock summary for ${files.length} files.';
    }
    async generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string> {
        return '```mermaid\nflowchart LR\n    A[Start] --> B[End]\n```';
    }

    async generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string> {
        return '# Agent Summary\n\nMock summary for agent work.';
    }
}
