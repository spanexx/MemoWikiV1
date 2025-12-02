import * as fs from 'fs';
import * as path from 'path';

/**
 * Manages the CodeWiki directory structure and file operations
 * Handles creation and management of wiki directories for memory, diagrams, and summaries
 */
export class WikiManager {
    private baseDir: string;
    private wikiDir: string;

    /**
     * Creates a new WikiManager instance
     * @param baseDir - The base directory for the wiki (defaults to current working directory)
     */
    constructor(baseDir: string = process.cwd()) {
        this.baseDir = baseDir;
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
        const filePath = path.join(this.wikiDir, 'memory', `${filename}.md`);
        fs.writeFileSync(filePath, content);
    }

    /**
     * Saves diagram content to a file in the diagrams directory
     * @param filename - The name of the file (without extension)
     * @param content - The content to save
     */
    saveDiagram(filename: string, content: string) {
        const filePath = path.join(this.wikiDir, 'diagrams', `${filename}.mmd`);
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
- [Memory](./memory)
- [Diagrams](./diagrams)
- [Summaries](./summaries)
    `;
        fs.writeFileSync(path.join(this.wikiDir, 'index.md'), content);
    }
}
