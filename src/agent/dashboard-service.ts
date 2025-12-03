import * as fs from 'fs';
import * as path from 'path';
import { ConfigManager } from '../config/config';
import { GitService } from '../observer/git-service';
import { CacheManager } from '../scanner/cache-manager';
import { SummaryRetriever } from '../wiki/summary-retriever';
import { FileFilter } from '../scanner/file-filter';
import { DashboardConfigManager } from '../config/dashboard-config';

export class DashboardService {
    private configManager: ConfigManager;
    private dashboardConfigManager: DashboardConfigManager;
    private gitService: GitService;
    private cacheManager: CacheManager;
    private summaryRetriever: SummaryRetriever;
    private fileFilter: FileFilter;
    private baseDir: string;

    constructor(baseDir: string = process.cwd()) {
        this.baseDir = baseDir;
        this.configManager = new ConfigManager();
        this.dashboardConfigManager = new DashboardConfigManager(baseDir);
        this.gitService = new GitService();
        this.cacheManager = new CacheManager(baseDir);
        this.summaryRetriever = new SummaryRetriever(path.join(baseDir, '.codewiki'));
        this.fileFilter = new FileFilter(baseDir);
    }

    async getOverviewStats() {
        const cache = this.cacheManager.getCache();
        const cacheEntries = Object.values(cache);
        const totalFiles = cacheEntries.length;

        // Calculate cache hit rate (mock calculation based on recent access if we had it, 
        // but for now we'll just return a placeholder or calculate based on something else)
        // Let's use documented files count vs total files in repo

        const allFiles = this.getAllFiles();
        const documentedFiles = cacheEntries.length;

        const summaries = await this.summaryRetriever.getRecent(100);

        // Count pending TODOs in summaries (mock logic as we don't parse TODOs yet)
        const pendingTodos = 12; // Placeholder

        return {
            filesDocumented: documentedFiles,
            cacheHitRate: 0.85, // Placeholder
            summariesCreated: summaries.length,
            pendingTodos: pendingTodos,
            lastUpdate: new Date().toISOString()
        };
    }

    async getActivityFeed(days: number = 7) {
        // Mock activity feed for now since we don't track granular events yet
        // In a real implementation, this would query a history log or git log
        return [
            {
                type: 'documentation',
                message: 'Updated documentation for auth-service.ts',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
                icon: '📝'
            },
            {
                type: 'summary',
                message: 'Generated project summary',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                icon: '📋'
            },
            {
                type: 'git',
                message: 'Synced with latest git changes',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
                icon: '🔄'
            }
        ];
    }

    async getFileStatuses() {
        const allFiles = this.getAllFiles();
        const cache = this.cacheManager.getCache();

        return allFiles.map(file => {
            const relPath = path.relative(this.baseDir, file);
            const cached = cache[file];

            let status = 'missing';
            if (cached) {
                // Check if stale (mock logic: if file mtime > cache timestamp)
                try {
                    const stats = fs.statSync(file);
                    if (stats.mtimeMs > cached.timestamp) {
                        status = 'stale';
                    } else {
                        status = 'documented';
                    }
                } catch (e) {
                    status = 'missing';
                }
            }

            return {
                path: relPath,
                status,
                lastUpdated: cached ? new Date(cached.timestamp).toISOString() : null,
                hasCache: !!cached
            };
        });
    }

    async getSummaries() {
        const summaries = await this.summaryRetriever.getRecent(50);
        return summaries.map(s => ({
            ...s,
            filesIncluded: s.files || [],
            todos: [], // Placeholder
            stubs: []  // Placeholder
        }));
    }

    getLLMConfig() {
        const config = this.configManager.getConfig();
        const dashboardConfig = this.dashboardConfigManager.getConfig();

        // Map config to dashboard model
        return {
            source: dashboardConfig.source,
            currentProvider: dashboardConfig.source === 'dashboard' ?
                (dashboardConfig.provider || config.provider) : config.provider,
            providers: [
                {
                    name: 'openai',
                    configured: !!config.openaiApiKey,
                    status: config.provider === 'openai' ? 'connected' : 'unconfigured',
                    model: config.openaiModel
                },
                {
                    name: 'anthropic',
                    configured: !!config.anthropicApiKey,
                    status: config.provider === 'anthropic' ? 'connected' : 'unconfigured',
                    model: config.anthropicModel
                },
                {
                    name: 'gemini',
                    configured: !!config.geminiApiKey,
                    status: config.provider === 'gemini' ? 'connected' : 'unconfigured',
                    model: config.geminiModel
                },
                {
                    name: 'openrouter',
                    configured: !!config.openrouterApiKey,
                    status: config.provider === 'openrouter' ? 'connected' : 'unconfigured',
                    model: config.openrouterModel
                },
                {
                    name: 'ollama',
                    configured: !!config.ollamaBaseUrl,
                    status: config.provider === 'ollama' ? 'connected' : 'unconfigured',
                    model: config.ollamaModel
                }
            ]
        };
    }

    updateLLMConfig(updates: any) {
        // Update dashboard config
        this.dashboardConfigManager.updateConfig(updates);

        return {
            success: true,
            message: 'Configuration updated successfully',
            config: this.getLLMConfig()
        };
    }

    async testLLMConnection(provider: string, apiKey?: string, model?: string) {
        // Mock connection test for now
        // In real implementation, would actually test the provider
        return {
            success: true,
            provider,
            latency: Math.floor(Math.random() * 500) + 100,
            message: 'Connection successful'
        };
    }

    getProviderModels(provider: string) {
        // Mock model list for now
        // In real implementation, fetch from actual provider
        const models: Record<string, string[]> = {
            openai: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'],
            anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-2.1'],
            gemini: ['gemini-pro', 'gemini-2.5-flash'],
            openrouter: ['nousresearch/hermes-3-llama-3.1-405b:free', 'meta-llama/llama-3.1-70b'],
            ollama: ['llama2', 'mistral', 'codellama']
        };

        return {
            models: (models[provider] || []).map(name => ({ name, id: name }))
        };
    }

    private getAllFiles(): string[] {
        // Use FileFilter to get all relevant files
        // We need a way to get *all* files, FileFilter usually filters a list
        // Let's implement a simple recursive find here or use the one from index.ts if exported
        // For now, simple recursive find
        return this.findFiles(this.baseDir);
    }

    private findFiles(dir: string): string[] {
        let results: string[] = [];
        if (!fs.existsSync(dir)) return results;
        if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.codewiki')) return results;

        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(this.findFiles(filePath));
            } else {
                // Filter using FileFilter logic if possible, or simple extension check
                if (this.fileFilter.shouldIncludeFile(filePath)) {
                    results.push(filePath);
                }
            }
        });
        return results;
    }
}
