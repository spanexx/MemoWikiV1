import { LLMService } from '../builder/llm-service';
import { CodeParser } from '../scanner/code-parser';
import { Config } from '../config/config';
import { CodeStructure } from '../types';
import * as fs from 'fs';

interface AnalysisResult {
    todos: string[];
    stubs: StubInfo[];
    completed: string[];
}

interface StubInfo {
    file: string;
    location: string;
    reason: string;
}

export interface ImplementationSummary {
    implemented: string[];
    stubbed: StubInfo[];
    todos: string[];
    integrationPoints: string[];
    nextSteps: string[];
    rawSummary: string;
}

export class SummaryGenerator {
    private codeParser: CodeParser;

    constructor(
        private llmService: LLMService,
        private config: Config
    ) {
        this.codeParser = new CodeParser();
    }

    async generateImplementationSummary(
        files: string[],
        type: 'feature' | 'bugfix' | 'refactor'
    ): Promise<ImplementationSummary> {
        // Parse files
        const structures: CodeStructure[] = [];
        for (const file of files) {
            try {
                const structure = this.codeParser.parseFile(file);
                structures.push(structure);
            } catch (err) {
                console.warn(`Warning: Could not parse ${file}`);
            }
        }

        // Analyze implementation
        const analysis = await this.analyzeImplementation(structures);

        // Generate summary with LLM
        const rawSummary = await this.llmService.generateAgentSummary(
            structures,
            type,
            analysis
        );

        return {
            implemented: analysis.completed,
            stubbed: analysis.stubs,
            todos: analysis.todos,
            integrationPoints: this.extractIntegrationPoints(structures),
            nextSteps: this.extractNextSteps(analysis),
            rawSummary
        };
    }

    private async analyzeImplementation(files: CodeStructure[]): Promise<AnalysisResult> {
        const todos = this.extractTODOs(files);
        const stubs = this.identifyStubs(files);
        const completed = this.identifyCompleted(files);

        return { todos, stubs, completed };
    }

    private extractTODOs(files: CodeStructure[]): string[] {
        const todos: string[] = [];

        for (const file of files) {
            try {
                const content = fs.readFileSync(file.file, 'utf-8');
                const lines = content.split('\n');

                lines.forEach((line, idx) => {
                    const todoMatch = line.match(/\/\/\s*(TODO|FIXME|XXX|HACK):\s*(.+)/i);
                    if (todoMatch) {
                        todos.push(`${file.file}:${idx + 1} - ${todoMatch[2].trim()}`);
                    }
                });
            } catch (err) {
                // Skip files that can't be read
            }
        }

        return todos;
    }

    private identifyStubs(files: CodeStructure[]): StubInfo[] {
        const stubs: StubInfo[] = [];

        for (const file of files) {
            try {
                const content = fs.readFileSync(file.file, 'utf-8');

                // Check for common stub patterns
                const stubPatterns = [
                    /throw new Error\(['"]Not implemented['"]\)/gi,
                    /return null;\s*\/\/\s*stub/gi,
                    /\/\/ TODO: implement/gi,
                    /console\.log\(['"]Not implemented['"]\)/gi
                ];

                stubPatterns.forEach(pattern => {
                    const matches = content.match(pattern);
                    if (matches) {
                        matches.forEach(match => {
                            stubs.push({
                                file: file.file,
                                location: 'detected in file',
                                reason: match.substring(0, 50)
                            });
                        });
                    }
                });
            } catch (err) {
                // Skip
            }
        }

        return stubs;
    }

    private identifyCompleted(files: CodeStructure[]): string[] {
        const completed: string[] = [];

        for (const file of files) {
            // List completed classes and functions
            file.classes.forEach(cls => {
                completed.push(`Class: ${cls.name}`);
            });

            file.functions.forEach(fn => {
                completed.push(`Function: ${fn.name}`);
            });
        }

        return completed;
    }

    private extractIntegrationPoints(files: CodeStructure[]): string[] {
        const points: string[] = [];

        for (const file of files) {
            // Extract imports as integration points
            file.imports.slice(0, 10).forEach(imp => {
                if (imp.moduleSpecifier && !imp.moduleSpecifier.startsWith('.')) {
                    points.push(`External: ${imp.moduleSpecifier}`);
                } else if (imp.moduleSpecifier) {
                    points.push(`Internal: ${imp.moduleSpecifier}`);
                }
            });
        }

        return [...new Set(points)]; // Deduplicate
    }

    private extractNextSteps(analysis: AnalysisResult): string[] {
        const steps: string[] = [];

        if (analysis.stubs.length > 0) {
            steps.push(`Complete ${analysis.stubs.length} stubbed implementation(s)`);
        }

        if (analysis.todos.length > 0) {
            steps.push(`Address ${analysis.todos.length} TODO item(s)`);
        }

        steps.push('Add comprehensive tests');
        steps.push('Update documentation');

        return steps;
    }
}
