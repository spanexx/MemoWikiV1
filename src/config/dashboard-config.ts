import * as fs from 'fs';
import * as path from 'path';

export interface DashboardConfig {
    source: 'env' | 'dashboard';
    provider?: string;
    openai?: {
        apiKey?: string;
        model?: string;
    };
    anthropic?: {
        apiKey?: string;
        model?: string;
    };
    gemini?: {
        apiKey?: string;
        model?: string;
    };
    openrouter?: {
        apiKey?: string;
        model?: string;
    };
    ollama?: {
        baseUrl?: string;
        model?: string;
    };
}

export class DashboardConfigManager {
    private configFile: string;
    private config: DashboardConfig;

    constructor(baseDir: string = process.cwd()) {
        this.configFile = path.join(baseDir, '.codewiki', 'dashboard-config.json');
        this.config = this.loadConfig();
    }

    private loadConfig(): DashboardConfig {
        if (fs.existsSync(this.configFile)) {
            try {
                const data = fs.readFileSync(this.configFile, 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                console.warn('Failed to load dashboard config, using defaults');
            }
        }

        // Default to using .env
        return { source: 'env' };
    }

    public getConfig(): DashboardConfig {
        return { ...this.config };
    }

    public updateConfig(updates: Partial<DashboardConfig>): void {
        this.config = {
            ...this.config,
            ...updates
        };
        this.saveConfig();
    }

    public setSource(source: 'env' | 'dashboard'): void {
        this.config.source = source;
        this.saveConfig();
    }

    private saveConfig(): void {
        const dir = path.dirname(this.configFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    }

    public isUsingDashboard(): boolean {
        return this.config.source === 'dashboard';
    }

    public getProviderConfig(provider: string): any {
        return this.config[provider as keyof DashboardConfig];
    }
}
