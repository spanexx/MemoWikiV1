import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface CacheEntry {
    contentHash: string;
    timestamp: number;
    llmProvider: string;
    llmModel: string;
    data: any;
}

interface CacheStore {
    [filePath: string]: CacheEntry;
}

export class CacheManager {
    private cacheDir: string;
    private cacheFile: string;
    private cache: CacheStore = {};

    public getCache(): CacheStore {
        return this.cache;
    }

    constructor(baseDir: string = process.cwd()) {
        this.cacheDir = path.join(baseDir, '.codewiki');
        this.cacheFile = path.join(this.cacheDir, 'cache.json');
        this.loadCache();
    }

    private loadCache() {
        if (fs.existsSync(this.cacheFile)) {
            try {
                const data = fs.readFileSync(this.cacheFile, 'utf-8');
                this.cache = JSON.parse(data);
            } catch (error) {
                console.warn('⚠️ Failed to load cache, starting fresh.');
                this.cache = {};
            }
        }
    }

    private saveCache() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
        fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
    }

    public calculateHash(content: string): string {
        return crypto.createHash('md5').update(content).digest('hex');
    }

    public get(filePath: string, contentHash: string, provider: string, model: string): any | null {
        const entry = this.cache[filePath];
        if (entry &&
            entry.contentHash === contentHash &&
            entry.llmProvider === provider &&
            entry.llmModel === model) {
            return entry.data;
        }
        return null;
    }

    public set(filePath: string, contentHash: string, provider: string, model: string, data: any) {
        this.cache[filePath] = {
            contentHash,
            timestamp: Date.now(),
            llmProvider: provider,
            llmModel: model,
            data
        };
        this.saveCache();
    }

    public async filterUnchanged(files: string[]): Promise<string[]> {
        const changedFiles: string[] = [];
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const hash = this.calculateHash(content);
            const entry = this.cache[file];
            if (!entry || entry.contentHash !== hash) {
                changedFiles.push(file);
            }
        }
        return changedFiles;
    }

    public getModelName(config: any): string {
        switch (config.provider) {
            case 'openai': return config.openaiModel;
            case 'anthropic': return config.anthropicModel;
            case 'gemini': return config.geminiModel;
            case 'openrouter': return config.openrouterModel;
            case 'ollama': return config.ollamaModel;
            default: return 'mock-model';
        }
    }
}
