#!/usr/bin/env node
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { GitService } from './observer/git-service';
import { CodeParser } from './scanner/code-parser';
import { LLMService } from './builder/llm-service';
import { WikiManager } from './wiki/wiki-manager';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

const program = new Command();

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
            const gitService = new GitService();
            const codeParser = new CodeParser();
            // TODO: Get API key from config/env
            const llmService = new LLMService(process.env.LLM_API_KEY || 'mock-key', 'mock');
            const wikiManager = new WikiManager();

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
                if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

                console.log(`   - Processing ${file}...`);
                try {
                    const structure = codeParser.parseFile(file);

                    // Generate Docs
                    const doc = await llmService.generateDocumentation(structure, gitState);
                    wikiManager.saveMemory(path.basename(file, path.extname(file)), doc);

                    // Generate Diagram
                    const diagram = await llmService.generateDiagram(structure);
                    wikiManager.saveDiagram(path.basename(file, path.extname(file)), diagram);
                } catch (err) {
                    console.warn(`   ⚠️ Failed to process ${file}:`, err);
                }
            }

            console.log('✨ MemoWiki update complete!');

        } catch (error) {
            console.error('❌ Error:', error);
            process.exit(1);
        }
    });

function findFiles(dir: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(filePath));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

program.parse(process.argv);
