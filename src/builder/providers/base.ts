import { CodeStructure, GitState } from '../../types';
import { config } from '../../config/config';

export interface LLMProvider {
    generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string>;
    generateDiagram(code: CodeStructure): Promise<string>;
    generateFlow(code: CodeStructure): Promise<string>;
    generateSummary(files: CodeStructure[], gitState: GitState): Promise<string>;
    generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string>;
    generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string>;
}

export abstract class BaseProvider implements LLMProvider {
    protected maxRetries: number;
    protected retryDelay: number;

    constructor() {
        this.maxRetries = config.maxRetries;
        this.retryDelay = config.retryDelay;
    }

    abstract generateDocumentation(code: CodeStructure, gitState: GitState): Promise<string>;
    abstract generateDiagram(code: CodeStructure): Promise<string>;
    abstract generateFlow(code: CodeStructure): Promise<string>;
    abstract generateSummary(files: CodeStructure[], gitState: GitState): Promise<string>;
    abstract generateArchitectureDiagram(files: CodeStructure[], gitState: GitState): Promise<string>;
    abstract generateAgentSummary(files: CodeStructure[], type: string, analysis: any): Promise<string>;

    protected async retryWithBackoff<T>(
        fn: () => Promise<T>,
        retries: number = this.maxRetries
    ): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0) {
                console.warn(`API call failed, retrying... (${retries} attempts left)`);
                await this.sleep(this.retryDelay);
                return this.retryWithBackoff(fn, retries - 1);
            }
            throw error;
        }
    }

    protected sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected buildDocumentationPrompt(code: CodeStructure, gitState: GitState): string {
        const hasRecent = !!gitState && !!gitState.recentCommit;
        const modifiedCount = (gitState && (gitState as any).status && Array.isArray((gitState as any).status.modified))
            ? (gitState as any).status.modified.length
            : 0;

        return `You are a technical documentation expert. Generate comprehensive, high-quality markdown documentation for the following code file.

File: ${code.file}

Code Structure:
- Classes: ${code.classes.map((c: any) => `${c.name} (${c.methods.length} methods)`).join(', ') || 'None'}
- Functions: ${code.functions.map((f: any) => f.name).join(', ') || 'None'}
- Interfaces: ${code.interfaces.map((i: any) => i.name).join(', ') || 'None'}
- Key Imports: ${code.imports.slice(0, 5).map((i: any) => i.moduleSpecifier).join(', ')}

Recent Git Context:
${hasRecent ? `Last commit: "${gitState.recentCommit?.message}" by ${gitState.recentCommit?.author_name}` : 'No recent commits'}
${modifiedCount > 0 ? `Modified files: ${modifiedCount}` : ''}

Generate a markdown documentation that includes:
1. **Overview**: A clear, high-level summary of what this file does and its role in the system.
2. **Architecture & Patterns**: Identify design patterns (e.g., Singleton, Factory, Observer) and architectural decisions.
3. **Key Components**:
   - Detailed description of major classes and their responsibilities.
   - Explanation of important functions and their logic.
4. **Dependencies**: Analysis of key imports and how this module interacts with others.
5. **Recent Changes**: Contextualize the recent git changes if available.

Format with clear headings, bullet points, and code snippets where appropriate. Keep it professional and insightful.`;
    }

    protected buildDiagramPrompt(code: CodeStructure): string {
        return `Generate a Mermaid class diagram for the following code structure.

File: ${code.file}

Classes:
${code.classes.map((c: any) => `- ${c.name}: methods [${c.methods.join(', ')}], properties [${c.properties.join(', ')}]`).join('\n')}

Interfaces:
${code.interfaces.map((i: any) => `- ${i.name}: properties [${i.properties.join(', ')}]`).join('\n')}

Generate ONLY the Mermaid diagram code WITHOUT markdown code fences. Do not wrap with triple backticks.
Include class relationships (inheritance, composition) if they can be inferred.
Use clear notation.
Begin with 'classDiagram'.`;
    }

    protected buildFlowPrompt(code: CodeStructure): string {
        return `Generate a Mermaid sequence diagram or flowchart that best represents the logic in this file.

File: ${code.file}

Classes:
${code.classes.map((c: any) => `- ${c.name}: methods [${c.methods.join(', ')}]`).join('\n')}

Functions:
${code.functions.map((f: any) => `- ${f.name}`).join('\n')}

Choose the most appropriate diagram type:
- **Sequence Diagram**: If the file involves interactions between multiple components/classes.
- **Flowchart**: If the file contains complex algorithmic logic or state transitions.

Generate ONLY the Mermaid diagram code WITHOUT markdown code fences. Do not wrap with triple backticks.
Focus on the main control flow or interaction pattern.
Begin with 'sequenceDiagram' or 'flowchart'.`;
    }

    protected buildSummaryPrompt(files: CodeStructure[], gitState: GitState): string {
        const fileList = files.map(f => `- ${f.file}: ${f.classes.length} classes, ${f.functions.length} functions`).join('\n');
        const totalClasses = files.reduce((sum, f) => sum + f.classes.length, 0);
        const totalFunctions = files.reduce((sum, f) => sum + f.functions.length, 0);
        const hasRecent = !!gitState && !!gitState.recentCommit;
        const modifiedCount = (gitState && (gitState as any).status && Array.isArray((gitState as any).status.modified))
            ? (gitState as any).status.modified.length
            : 0;

        return `You are a software architect creating a high-level system overview. Generate a comprehensive markdown summary of this codebase.

Project Statistics:
- Total Files: ${files.length}
- Total Classes: ${totalClasses}
- Total Functions: ${totalFunctions}

Files:
${fileList}

Recent Git Context:
${hasRecent ? `Last commit: "${gitState.recentCommit?.message}" by ${gitState.recentCommit?.author_name}` : 'No recent commits'}
${modifiedCount > 0 ? `Modified files: ${modifiedCount}` : ''}

Generate a markdown summary that includes:
1. **System Overview**: What is this project? What problem does it solve?
2. **Architecture**: High-level architecture patterns and design decisions.
3. **Key Components**: Main modules/packages and their purposes.
4. **Technology Stack**: Languages, frameworks, and major dependencies identified.
5. **Code Organization**: How the code is structured and organized.
6. **Recent Activity**: Analysis of recent changes and development direction.

Be insightful and provide value beyond just listing files. Identify patterns, relationships, and the overall system design.`;
    }

    protected buildArchitectureDiagramPrompt(files: CodeStructure[], gitState: GitState): string {
        const components = files.map(f => {
            const name = f.file.split('/').pop()?.replace('.ts', '') || f.file;
            return `- ${name}: ${f.classes.map(c => c.name).join(', ') || 'utility functions'}`;
        }).join('\n');

        return `Generate a Mermaid flowchart that shows the architectural wiring of this system - how components connect and interact.

Project Components:
${components}

Create a flowchart (or architecture diagram) that shows:
1. Main entry point (index.ts)
2. Core services and their relationships
3. Data flow between components
4. External integrations (Git, LLM, ChromaDB, etc.)
5. How components are orchestrated

Use clear node labels and show directional relationships. Make it insightful about the system architecture.
Generate ONLY Mermaid code WITHOUT markdown code fences. Do not wrap with triple backticks.
Begin with 'flowchart'.`;
    }

    protected buildAgentSummaryPrompt(
        files: CodeStructure[],
        type: string,
        analysis: any
    ): string {
        const filesList = files.map(f => f.file).join(', ');
        const todoCount = analysis.todos.length;
        const stubCount = analysis.stubs.length;
        const completedCount = analysis.completed.length;
        const todoList = analysis.todos.join('\n');
        const stubList = analysis.stubs.map((s: any) => `- ${s.file}: ${s.reason}`).join('\n');
        const completedList = analysis.completed.join('\n');

        return `Generate an implementation summary for an AI agent's work.
        
Files Modified: ${filesList}
Type: ${type}

Detected Analysis:
- TODOs: ${todoCount}
- Stubs: ${stubCount}
- Completed Items: ${completedCount}

Analysis Details:
TODOs:
${todoList}

Stubs:
${stubList}

Completed:
${completedList}

Create a concise markdown summary with the following sections:
1. **What Was Implemented**: Fully functional features
2. **What Was Stubbed**: Placeholder/incomplete code
3. **Outstanding TODOs**: What still needs work
4. **Integration Points**: How this connects to the system
5. **Next Steps**: Suggested follow-up work

Be concise, actionable, and focus on the implementation details.`;
    }
}
