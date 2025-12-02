#!/usr/bin/env node
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
const commander_1 = require("commander");
const dotenv = __importStar(require("dotenv"));
const git_service_1 = require("./observer/git-service");
const code_parser_1 = require("./scanner/code-parser");
const llm_service_1 = require("./builder/llm-service");
const wiki_manager_1 = require("./wiki/wiki-manager");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
dotenv.config();
const program = new commander_1.Command();
program
    .name('memowiki')
    .description('A persistent memory layer for your codebase')
    .version('1.0.0');
program
    .command('update')
    .description('Update the wiki based on current code state and git status')
    .action(async () => {
    try {
        console.log('🚀 Starting MemoWiki update...');
        // 1. Initialize Services
        const gitService = new git_service_1.GitService();
        const codeParser = new code_parser_1.CodeParser();
        // TODO: Get API key from config/env
        const llmService = new llm_service_1.LLMService(process.env.LLM_API_KEY || 'mock-key', 'mock');
        const wikiManager = new wiki_manager_1.WikiManager();
        // 2. Check Git Status
        console.log('👀 Observing git status...');
        const isRepo = await gitService.isRepo();
        if (!isRepo) {
            console.error('❌ Not a git repository.');
            process.exit(1);
        }
        const gitState = await gitService.getGitState();
        console.log(`   - Modified files: ${gitState.status.modified.length}`);
        console.log(`   - Recent commit: ${gitState.recentCommit?.message || 'None'}`);
        // 3. Initialize Wiki
        console.log('📚 Initializing wiki...');
        wikiManager.initialize();
        // 4. Scan and Update
        // For this MVP, we'll scan modified files or all files if it's a fresh run
        // For now, let's just scan files in src/
        // In a real app, we'd be smarter about what to scan
        const filesToScan = gitState.status.modified.length > 0
            ? gitState.status.modified
            : findFiles('src'); // Simple helper to find files
        console.log(`🔍 Scanning ${filesToScan.length} files...`);
        for (const file of filesToScan) {
            if (!file.endsWith('.ts') && !file.endsWith('.js'))
                continue;
            console.log(`   - Processing ${file}...`);
            try {
                const structure = codeParser.parseFile(file);
                // Generate Docs
                const doc = await llmService.generateDocumentation(structure, gitState);
                wikiManager.saveMemory(path.basename(file, path.extname(file)), doc);
                // Generate Diagram
                const diagram = await llmService.generateDiagram(structure);
                wikiManager.saveDiagram(path.basename(file, path.extname(file)), diagram);
            }
            catch (err) {
                console.warn(`   ⚠️ Failed to process ${file}:`, err);
            }
        }
        console.log('✨ MemoWiki update complete!');
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
});
function findFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir))
        return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(filePath));
        }
        else {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                results.push(filePath);
            }
        }
    });
    return results;
}
program.parse(process.argv);
