import * as fs from 'fs';
import * as path from 'path';

import { Config, config as globalConfig } from '../config/config';

/**
 * Manages the CodeWiki directory structure and file operations
 * Handles creation and management of wiki directories for memory, diagrams, and summaries
 */
export class WikiManager {
    private baseDir: string;
    private wikiDir: string;
    private config: Config;

    /**
     * Creates a new WikiManager instance
     * @param baseDir - The base directory for the wiki (defaults to current working directory)
     * @param config - Optional configuration object
     */
    constructor(baseDir: string = process.cwd(), config?: Config) {
        this.baseDir = baseDir;
        this.config = config || globalConfig;
        this.wikiDir = path.join(baseDir, '.codewiki');
    }

    /**
     * Initializes the wiki directory structure
     * Creates the main wiki directory and subdirectories for memory, diagrams, and summaries
     * Also creates an index file if it doesn't exist
     */
    initialize() {
        if (!fs.existsSync(this.wikiDir)) {
            fs.mkdirSync(this.wikiDir);
            fs.mkdirSync(path.join(this.wikiDir, 'memory'));
            fs.mkdirSync(path.join(this.wikiDir, 'diagrams'));
            fs.mkdirSync(path.join(this.wikiDir, 'flows'));
            fs.mkdirSync(path.join(this.wikiDir, 'summaries'));
            this.createIndex();
        }
    }

    /**
     * Saves memory content to a file in the memory directory
     * @param filename - The name of the file (without extension)
     * @param content - The content to save
     */
    saveMemory(filename: string, content: string) {
        const dirPath = path.join(this.wikiDir, 'memory');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, `${filename}.md`);
        fs.writeFileSync(filePath, content);
    }

    appendToSummary(filename: string, content: string): string {
        const summariesDir = path.join(this.wikiDir, 'summaries');
        if (!fs.existsSync(summariesDir)) {
            fs.mkdirSync(summariesDir, { recursive: true });
        }

        const filePath = path.join(summariesDir, `${filename}.md`);

        if (fs.existsSync(filePath)) {
            const existing = fs.readFileSync(filePath, 'utf-8');
            const separator = `\n\n---\n\n## Update: ${new Date().toISOString()}\n\n`;
            fs.writeFileSync(filePath, existing + separator + content);
        } else {
            fs.writeFileSync(filePath, content);
        }

        return filePath;
    }

    /**
     * Saves diagram content to a file in the diagrams directory
     * @param filename - The name of the file (without extension)
     * @param content - The content to save
     */
    saveDiagram(filename: string, content: string) {
        const dirPath = path.join(this.wikiDir, 'diagrams');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, `${filename}.mmd`);
        const normalized = this.extractMermaid(content);
        fs.writeFileSync(filePath, normalized);
    }

    /**
     * Saves flow content to a file in the flows directory
     * @param filename - The name of the file (without extension)
     * @param content - The content to save
     */
    saveFlow(filename: string, content: string) {
        const flowsDir = path.join(this.wikiDir, 'flows');
        if (!fs.existsSync(flowsDir)) {
            fs.mkdirSync(flowsDir, { recursive: true });
        }
        const filePath = path.join(flowsDir, `${filename}.mmd`);
        const normalized = this.extractMermaid(content);
        fs.writeFileSync(filePath, normalized);
    }

    /**
     * Saves summary content to a file in the summaries directory
     * @param filename - The name of the file (without extension)
     * @param content - The content to save
     */
    saveSummary(filename: string, content: string) {
        const dirPath = path.join(this.wikiDir, 'summaries');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, `${filename}.md`);
        fs.writeFileSync(filePath, content);
    }

    /**
     * Creates the main index file for the wiki
     * This file serves as the entry point for navigating the wiki
     * @private
     */
    private createIndex() {
        const content = `
# CodeWiki

Welcome to your codebase's persistent memory.

## Sections
- [Memory](./memory) - Detailed documentation for each file
- [Diagrams](./diagrams) - Class diagrams and relationships
- [Flows](./flows) - Sequence diagrams and flowcharts
- [Summaries](./summaries) - High-level system overviews
    `;
        fs.writeFileSync(path.join(this.wikiDir, 'index.md'), content);
    }

    private extractMermaid(content: string): string {
        const fence = /```(?:mermaid)?\s*([\s\S]*?)```/i;
        const match = content.match(fence);
        const inner = match ? match[1] : content;
        return inner.trim() + '\n';
    }
}
