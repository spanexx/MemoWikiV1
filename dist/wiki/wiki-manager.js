"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_1 = require("../config/config");
/**
 * Manages the CodeWiki directory structure and file operations
 * Handles creation and management of wiki directories for memory, diagrams, and summaries
 */
class WikiManager {
    baseDir;
    wikiDir;
    config;
    /**
     * Creates a new WikiManager instance
     * @param baseDir - The base directory for the wiki (defaults to current working directory)
     * @param config - Optional configuration object
     */
    constructor(baseDir = process.cwd(), config) {
        this.baseDir = baseDir;
        this.config = config || config_1.config;
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
    saveMemory(filename, content) {
        const dirPath = path.join(this.wikiDir, 'memory');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, `${filename}.md`);
        fs.writeFileSync(filePath, content);
    }
    appendToSummary(filename, content) {
        const summariesDir = path.join(this.wikiDir, 'summaries');
        if (!fs.existsSync(summariesDir)) {
            fs.mkdirSync(summariesDir, { recursive: true });
        }
        const filePath = path.join(summariesDir, `${filename}.md`);
        if (fs.existsSync(filePath)) {
            const existing = fs.readFileSync(filePath, 'utf-8');
            const separator = `\n\n---\n\n## Update: ${new Date().toISOString()}\n\n`;
            fs.writeFileSync(filePath, existing + separator + content);
        }
        else {
            fs.writeFileSync(filePath, content);
        }
        return filePath;
    }
    /**
     * Saves diagram content to a file in the diagrams directory
     * @param filename - The name of the file (without extension)
     * @param content - The content to save
     */
    saveDiagram(filename, content) {
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
    saveFlow(filename, content) {
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
    saveSummary(filename, content) {
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
    createIndex() {
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
    extractMermaid(content) {
        const fence = /```(?:mermaid)?\s*([\s\S]*?)```/i;
        const match = content.match(fence);
        const inner = match ? match[1] : content;
        return inner.trim() + '\n';
    }
}
exports.WikiManager = WikiManager;
