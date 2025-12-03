import express, { Request, Response } from 'express';
import cors from 'cors';
import * as path from 'path';
import { ContextService } from './context-service';
import { Config, config as globalConfig } from '../config/config';
import { DashboardService } from './dashboard-service';

export class AgentAPI {
    private app: express.Application;
    private contextService: ContextService;
    private dashboardService: DashboardService;
    private port: number;
    private config: Config;

    constructor(port: number = 3000, config?: Config) {
        this.app = express();
        this.port = port;
        this.config = config || globalConfig;
        this.contextService = new ContextService();
        this.dashboardService = new DashboardService();
        this.setupMiddleware();
        this.setupRoutes();
    }

    private setupMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());

        // Serve static dashboard files
        // Assuming dashboard is built to dist/dashboard/browser in the project root
        // or dashboard/dist/dashboard/browser
        const dashboardPath = path.join(process.cwd(), 'dashboard', 'dist', 'dashboard', 'browser');
        if (require('fs').existsSync(dashboardPath)) {
            this.app.use(express.static(dashboardPath));
        }
    }

    private setupRoutes(): void {
        // ... existing routes ...

        // Dashboard API Routes
        const apiRouter = express.Router();

        apiRouter.get('/stats/overview', async (req, res) => {
            try {
                const stats = await this.dashboardService.getOverviewStats();
                res.json(stats);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        apiRouter.get('/files/status', async (req, res) => {
            try {
                const files = await this.dashboardService.getFileStatuses();
                res.json(files);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        apiRouter.get('/summaries', async (req, res) => {
            try {
                const summaries = await this.dashboardService.getSummaries();
                res.json(summaries);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        apiRouter.get('/config/llm', (req, res) => {
            try {
                const config = this.dashboardService.getLLMConfig();
                res.json(config);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        apiRouter.put('/config/llm', (req, res) => {
            try {
                const result = this.dashboardService.updateLLMConfig(req.body);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        apiRouter.post('/config/llm/test', async (req, res) => {
            try {
                const { provider, apiKey, model } = req.body;
                const result = await this.dashboardService.testLLMConnection(provider, apiKey, model);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        apiRouter.get('/config/llm/providers/:provider/models', (req, res) => {
            try {
                const provider = req.params.provider;
                const result = this.dashboardService.getProviderModels(provider);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        apiRouter.get('/activity', async (req, res) => {
            try {
                const days = parseInt(req.query.days as string) || 7;
                const activities = await this.dashboardService.getActivityFeed(days);
                res.json(activities);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        });

        this.app.use('/api/v1', apiRouter);

        // Health check
        this.app.get('/health', (req: Request, res: Response) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        // Get context for a specific file
        this.app.get('/api/context/:file', async (req: Request, res: Response) => {
            try {
                const file = req.params.file;
                const context = await this.contextService.getContext({ file });
                const formatted = this.contextService.formatForLLM(context);

                res.json({
                    success: true,
                    context,
                    formatted,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: (error as Error).message,
                });
            }
        });

        // Semantic search
        this.app.get('/api/search', async (req: Request, res: Response) => {
            try {
                const query = req.query.q as string;
                const limit = parseInt(req.query.limit as string) || 10;

                if (!query) {
                    return res.status(400).json({
                        success: false,
                        error: 'Query parameter "q" is required',
                    });
                }

                if (!this.config.enableSemanticSearch) {
                    return res.status(503).json({
                        success: false,
                        error: 'Semantic search is disabled',
                    });
                }

                const context = await this.contextService.getContext({
                    semanticQuery: query,
                    limit,
                });

                res.json({
                    success: true,
                    query,
                    results: context.files,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: (error as Error).message,
                });
            }
        });

        // Get all available files
        this.app.get('/api/files', async (req: Request, res: Response) => {
            try {
                const context = await this.contextService.getContext({});

                res.json({
                    success: true,
                    files: context.files.map(f => f.file),
                    count: context.files.length,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: (error as Error).message,
                });
            }
        });

        // Get recent changes
        this.app.get('/api/recent-changes', async (req: Request, res: Response) => {
            try {
                const context = await this.contextService.getContext({});

                res.json({
                    success: true,
                    recentChanges: context.recentChanges,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: (error as Error).message,
                });
            }
        });

        // Fallback to index.html for Angular routing
        this.app.get(new RegExp('.*'), (req, res, next) => {
            if (req.path.startsWith('/api')) {
                next();
                return;
            }
            const dashboardPath = path.join(process.cwd(), 'dashboard', 'dist', 'dashboard', 'browser');
            const indexPath = path.join(dashboardPath, 'index.html');
            if (require('fs').existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                next();
            }
        });
    }

    async start(): Promise<void> {
        await this.contextService.initialize(this.config.enableSemanticSearch);

        this.app.listen(this.port, () => {
            console.log(`🚀 MemoWiki Agent API running on http://localhost:${this.port}`);
            console.log(`   Health check: http://localhost:${this.port}/health`);
            console.log(`   Dashboard: http://localhost:${this.port}`);
        });
    }
}
