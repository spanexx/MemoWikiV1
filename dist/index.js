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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextService = exports.AgentAPI = exports.ConfigManager = exports.FileFilter = exports.WikiManager = exports.LLMService = exports.CodeParser = exports.GitService = void 0;
const commander_1 = require("commander");
const dotenv = __importStar(require("dotenv"));
const chalk_1 = __importDefault(require("chalk"));
const git_service_1 = require("./observer/git-service");
const code_parser_1 = require("./scanner/code-parser");
const llm_service_1 = require("./builder/llm-service");
const wiki_manager_1 = require("./wiki/wiki-manager");
const file_filter_1 = require("./scanner/file-filter");
const cache_manager_1 = require("./scanner/cache-manager");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
dotenv.config();
const config_1 = require("./config/config");
// Export core classes for programmatic use
var git_service_2 = require("./observer/git-service");
Object.defineProperty(exports, "GitService", { enumerable: true, get: function () { return git_service_2.GitService; } });
var code_parser_2 = require("./scanner/code-parser");
Object.defineProperty(exports, "CodeParser", { enumerable: true, get: function () { return code_parser_2.CodeParser; } });
var llm_service_2 = require("./builder/llm-service");
Object.defineProperty(exports, "LLMService", { enumerable: true, get: function () { return llm_service_2.LLMService; } });
var wiki_manager_2 = require("./wiki/wiki-manager");
Object.defineProperty(exports, "WikiManager", { enumerable: true, get: function () { return wiki_manager_2.WikiManager; } });
var file_filter_2 = require("./scanner/file-filter");
Object.defineProperty(exports, "FileFilter", { enumerable: true, get: function () { return file_filter_2.FileFilter; } });
var config_2 = require("./config/config");
Object.defineProperty(exports, "ConfigManager", { enumerable: true, get: function () { return config_2.ConfigManager; } });
var agent_api_1 = require("./agent/agent-api");
Object.defineProperty(exports, "AgentAPI", { enumerable: true, get: function () { return agent_api_1.AgentAPI; } });
var context_service_1 = require("./agent/context-service");
Object.defineProperty(exports, "ContextService", { enumerable: true, get: function () { return context_service_1.ContextService; } });
const program = new commander_1.Command();
program
    .name('memowiki')
    .description('A persistent memory layer for your codebase')
    .version('1.0.0');
program
    .command('update')
    .description('Update the wiki based on current code state and git status')
    .option('--full', 'Force full scan (ignore git diff)')
    .option('--verbose', 'Show detailed output')
    .action(async (options) => {
    const config = config_1.configManager.getConfig();
    try {
        console.log(chalk_1.default.blue('🚀 Starting MemoWiki update...'));
        // 1. Initialize Services
        const gitService = new git_service_1.GitService();
        const codeParser = new code_parser_1.CodeParser();
        const llmService = new llm_service_1.LLMService(config);
        const wikiManager = new wiki_manager_1.WikiManager(process.cwd(), config);
        const cacheManager = new cache_manager_1.CacheManager(process.cwd());
        // 2. Determine files to process
        let filesToProcess = [];
        let gitState = {};
        if (options.full) {
            console.log(chalk_1.default.yellow('⚠️  Forcing full scan...'));
            filesToProcess = findFiles(process.cwd());
        }
        else {
            // Get git status
            gitState = await gitService.getGitState();
            // Filter files
            const fileFilter = new file_filter_1.FileFilter(process.cwd());
            filesToProcess = fileFilter.filterFiles(gitState.status.modified);
        }
        // Filter out unchanged files using cache
        const changedFiles = await cacheManager.filterUnchanged(filesToProcess);
        if (changedFiles.length === 0 && !options.full) {
            console.log(chalk_1.default.green('✨ No changes detected. Documentation is up to date.'));
            return;
        }
        if (changedFiles.length < filesToProcess.length) {
            console.log(chalk_1.default.blue(`ℹ️  Processing ${changedFiles.length} changed files (skipped ${filesToProcess.length - changedFiles.length} unchanged)`));
        }
        // Generate documentation for changed files
        const fileStructures = [];
        let cached = 0;
        for (const file of changedFiles) {
            console.log(chalk_1.default.gray(`   Processing ${file}...`));
            const structure = codeParser.parseFile(file);
            fileStructures.push(structure);
            const content = fs.readFileSync(file, 'utf-8');
            const contentHash = cacheManager.calculateHash(content);
            const modelName = cacheManager.getModelName(config);
            // Check cache
            const cachedData = cacheManager.get(file, contentHash, config.provider, modelName);
            if (cachedData) {
                if (options.verbose)
                    console.log('      ♻️  Using cached data');
                wikiManager.saveMemory(path.basename(file, path.extname(file)), cachedData.documentation);
                wikiManager.saveDiagram(path.basename(file, path.extname(file)), cachedData.diagram);
                cached++;
            }
            else {
                // Generate fresh
                const doc = await llmService.generateDocumentation(structure, gitState);
                wikiManager.saveMemory(path.basename(file, path.extname(file)), doc);
                const diagram = await llmService.generateDiagram(structure);
                wikiManager.saveDiagram(path.basename(file, path.extname(file)), diagram);
                // Update cache
                cacheManager.set(file, contentHash, config.provider, modelName, {
                    documentation: doc,
                    diagram: diagram
                });
            }
        }
        if (cached > 0) {
            console.log(`♻️  Used cache for ${cached}/${changedFiles.length} files`);
        }
        // Generate high-level summary
        console.log(chalk_1.default.blue('📊 Generating project summary...'));
        // Scan all files for summary generation
        const allFiles = findFiles(process.cwd());
        const fileFilter = new file_filter_1.FileFilter(process.cwd());
        const filteredAllFiles = fileFilter.filterFiles(allFiles);
        const allStructures = filteredAllFiles.map(f => codeParser.parseFile(f));
        const summary = await llmService.generateSummary(allStructures, gitState);
        wikiManager.saveSummary('project-overview', summary);
        // Generate architecture diagram
        console.log(chalk_1.default.blue('📐 Generating architecture diagram...'));
        const archDiagram = await llmService.generateArchitectureDiagram(allStructures, gitState);
        wikiManager.saveFlow('architecture', archDiagram);
        console.log(chalk_1.default.green('✨ Documentation updated successfully!'));
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Error updating documentation:'), error);
        process.exit(1);
    }
});
program
    .command('record')
    .description('Record an implementation summary for agent work')
    .option('-f, --files <files...>', 'Files that were modified')
    .option('-o, --output <name>', 'Output summary name')
    .option('-t, --type <type>', 'Summary type: feature|bugfix|refactor', 'feature')
    .option('--append', 'Append to existing summary instead of creating new')
    .action(async (options) => {
    const config = config_1.configManager.getConfig();
    const llmService = new llm_service_1.LLMService(config);
    const wikiManager = new wiki_manager_1.WikiManager(process.cwd(), config);
    const wikiDir = path.join(process.cwd(), '.codewiki');
    // Dynamic import to avoid circular dependencies if any
    const { SummaryGenerator } = await Promise.resolve().then(() => __importStar(require('./agent/summary-generator')));
    const { SummaryIndex } = await Promise.resolve().then(() => __importStar(require('./wiki/summary-index')));
    const generator = new SummaryGenerator(llmService, config);
    const index = new SummaryIndex(wikiDir);
    let targetFiles = [];
    if (options.files) {
        targetFiles = options.files;
    }
    else {
        // Auto-detect from git
        const gitService = new git_service_1.GitService();
        const state = await gitService.getGitState();
        targetFiles = [...state.status.modified, ...state.status.created];
        if (targetFiles.length === 0) {
            console.log(chalk_1.default.yellow('No changed files detected. Please specify files with -f'));
            return;
        }
    }
    console.log(chalk_1.default.blue(`📝 Generating summary for ${targetFiles.length} files...`));
    const summary = await generator.generateImplementationSummary(targetFiles, options.type);
    let outputName = options.output;
    if (!outputName) {
        const timestamp = new Date().toISOString().split('T')[0];
        outputName = `implementation-${timestamp}`;
    }
    let filePath;
    if (options.append) {
        filePath = wikiManager.appendToSummary(outputName, summary.rawSummary);
        console.log(chalk_1.default.green(`✨ Appended summary to ${filePath}`));
    }
    else {
        // If not appending, ensure unique name if file exists
        if (!options.output) {
            // Add time to make unique
            outputName = `${outputName}-${Date.now()}`;
        }
        wikiManager.saveSummary(outputName, summary.rawSummary);
        filePath = path.join(wikiDir, 'summaries', `${outputName}.md`);
        console.log(chalk_1.default.green(`✨ Saved summary to ${filePath}`));
    }
    // Update index
    await index.addEntry({
        id: outputName,
        timestamp: Date.now(),
        type: options.type,
        files: targetFiles,
        summaryPath: `summaries/${outputName}.md`
    });
});
program
    .command('summaries')
    .description('Query agent implementation summaries')
    .option('-f, --file <file>', 'Filter by file path')
    .option('-t, --type <type>', 'Filter by summary type')
    .option('-r, --recent <number>', 'Get recent summaries', '10')
    .action(async (options) => {
    const wikiDir = path.join(process.cwd(), '.codewiki');
    // Dynamic import
    const { SummaryRetriever } = await Promise.resolve().then(() => __importStar(require('./wiki/summary-retriever')));
    const retriever = new SummaryRetriever(wikiDir);
    try {
        let entries = [];
        if (options.file) {
            entries = await retriever.getByFile(options.file);
        }
        else if (options.type) {
            entries = await retriever.getByType(options.type);
        }
        else {
            entries = await retriever.getRecent(parseInt(options.recent));
        }
        if (entries.length === 0) {
            console.log(chalk_1.default.yellow('No summaries found matching criteria.'));
            return;
        }
        console.log(chalk_1.default.blue(`Found ${entries.length} summaries:\n`));
        entries.forEach(entry => {
            const date = new Date(entry.timestamp).toISOString().split('T')[0];
            console.log(chalk_1.default.bold(`${entry.id} (${date})`));
            console.log(`Type: ${entry.type}`);
            console.log(`Files: ${entry.files.length} files`);
            console.log(`Path: ${entry.summaryPath}`);
            console.log('---');
        });
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Error retrieving summaries:'), error);
        process.exit(1);
    }
});
program
    .command('search <query>')
    .description('Search wiki for code using semantic search')
    .option('-n, --limit <number>', 'Number of results to return', '10')
    .action(async (query, options) => {
    try {
        const { SearchService } = await Promise.resolve().then(() => __importStar(require('./search/search-service')));
        const { configManager } = await Promise.resolve().then(() => __importStar(require('./config/config')));
        const config = configManager.getConfig();
        if (!config.enableSemanticSearch) {
            console.error('❌ Semantic search is disabled. Enable it in .env with ENABLE_SEMANTIC_SEARCH=true');
            process.exit(1);
        }
        console.log(`🔍 Searching for: "${query}"`);
        const searchService = new SearchService();
        await searchService.initialize();
        const results = await searchService.search(query, parseInt(options.limit));
        if (results.length === 0) {
            console.log('No results found.');
            return;
        }
        console.log(`\n📊 Found ${results.length} results:\n`);
        results.forEach((result, index) => {
            console.log(`${index + 1}. [${(result.similarity * 100).toFixed(1)}%] ${result.id}`);
            console.log(`   ${result.metadata.type}: ${result.metadata.name || result.metadata.file}`);
            console.log(`   ${result.content.substring(0, 100)}...\n`);
        });
    }
    catch (error) {
        console.error('❌ Search error:', error);
        process.exit(1);
    }
});
program
    .command('analyze')
    .description('Analyze git repository for insights')
    .action(async () => {
    try {
        const { GitService } = await Promise.resolve().then(() => __importStar(require('./observer/git-service')));
        console.log('📊 Analyzing git repository...\n');
        const gitService = new GitService();
        const isRepo = await gitService.isRepo();
        if (!isRepo) {
            console.error('❌ Not a git repository.');
            process.exit(1);
        }
        const gitState = await gitService.getGitState();
        console.log('=== Repository Status ===');
        console.log(`Modified files: ${gitState.status.modified.length}`);
        console.log(`Created files: ${gitState.status.created.length}`);
        console.log(`Deleted files: ${gitState.status.deleted.length}`);
        if (gitState.recentCommit) {
            console.log('\n=== Recent Commit ===');
            console.log(`Message: ${gitState.recentCommit.message}`);
            console.log(`Author: ${gitState.recentCommit.author_name}`);
            console.log(`Date: ${gitState.recentCommit.date}`);
        }
        console.log('\n=== Branch Information ===');
        console.log(`Current Branch: ${gitState.branch.current}`);
        if (gitState.branch.upstream) {
            console.log(`Upstream: ${gitState.branch.upstream}`);
            console.log(`Ahead: ${gitState.branch.ahead} / Behind: ${gitState.branch.behind}`);
        }
        if (gitState.conflicts.length > 0) {
            console.log('\n⚠️  Merge Conflicts Detected:');
            gitState.conflicts.forEach(file => console.log(`  - ${file}`));
        }
        console.log('\n✨ Analysis complete!');
    }
    catch (error) {
        console.error('❌ Analysis error:', error);
        process.exit(1);
    }
});
program
    .command('serve')
    .description('Start agent API server for external integrations')
    .option('-p, --port <number>', 'Port to run server on', '3000')
    .action(async (options) => {
    try {
        const { AgentAPI } = await Promise.resolve().then(() => __importStar(require('./agent/agent-api')));
        const { configManager } = await Promise.resolve().then(() => __importStar(require('./config/config')));
        const config = configManager.getConfig();
        const port = parseInt(options.port);
        const api = new AgentAPI(port, config);
        await api.start();
    }
    catch (error) {
        console.error('❌ Server error:', error);
        process.exit(1);
    }
});
program
    .command('intent')
    .description('Analyze intent of current code changes')
    .action(async () => {
    const config = config_1.configManager.getConfig();
    try {
        const { IntentAnalyzer } = await Promise.resolve().then(() => __importStar(require('./agent/intent-analyzer')));
        console.log(chalk_1.default.blue('🔍 Analyzing intent of current changes...\n'));
        const analyzer = new IntentAnalyzer(config);
        const analysis = await analyzer.analyzeCurrentChanges();
        console.log(`Intent: ${analysis.intent}`);
        console.log(`Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);
        console.log(`Summary: ${analysis.summary}\n`);
        if (analysis.suggestions.length > 0) {
            console.log('Suggestions:');
            analysis.suggestions.forEach((s, i) => {
                console.log(`  ${i + 1}. ${s}`);
            });
        }
        console.log('\n✨ Analysis complete!');
    }
    catch (error) {
        console.error('❌ Intent analysis error:', error);
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
            results.push(filePath);
        }
    });
    return results;
}
program.parse(process.argv);
