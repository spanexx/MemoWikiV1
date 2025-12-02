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
/**
 * Manages the CodeWiki directory structure and file operations
 * Handles creation and management of wiki directories for memory, diagrams, and summaries
 */
class WikiManager {
    baseDir;
    wikiDir;
    /**
     * Creates a new WikiManager instance
     * @param baseDir - The base directory for the wiki (defaults to current working directory)
     */
    constructor(baseDir = process.cwd()) {
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
    saveMemory(filename, content) {
        const filePath = path.join(this.wikiDir, 'memory', `${filename}.md`);
        fs.writeFileSync(filePath, content);
    }
    /**
     * Saves diagram content to a file in the diagrams directory
     * @param filename - The name of the file (without extension)
     * @param content - The content to save
     */
    saveDiagram(filename, content) {
        const filePath = path.join(this.wikiDir, 'diagrams', `${filename}.mmd`);
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
- [Memory](./memory)
- [Diagrams](./diagrams)
- [Summaries](./summaries)
    `;
        fs.writeFileSync(path.join(this.wikiDir, 'index.md'), content);
    }
}
exports.WikiManager = WikiManager;
