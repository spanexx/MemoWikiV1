import * as fs from 'fs';
import * as path from 'path';
import { SearchService } from '../search/search-service';
import { GitService } from '../observer/git-service';

export interface ContextQuery {
    file?: string;
    type?: 'file' | 'class' | 'function';
    semanticQuery?: string;
    limit?: number;
}

export interface FormattedContext {
    summary: string;
    files: FileContext[];
    recentChanges?: string;
}

export interface FileContext {
    file: string;
    documentation: string;
    relevance?: number;
}

export class ContextService {
    private wikiDir: string;
    private searchService?: SearchService;
    private gitService: GitService;

    constructor(baseDir: string = process.cwd()) {
        this.wikiDir = path.join(baseDir, '.codewiki');
        this.gitService = new GitService();
    }

    async initialize(enableSemanticSearch: boolean = false): Promise<void> {
        if (enableSemanticSearch) {
            this.searchService = new SearchService();
            await this.searchService.initialize();
        }
    }

    async getContext(query: ContextQuery): Promise<FormattedContext> {
        let files: FileContext[] = [];

        // Semantic search if available and query provided
        if (query.semanticQuery && this.searchService) {
            const results = await this.searchService.search(query.semanticQuery, query.limit || 5);
            files = results.map(r => ({
                file: r.metadata.file || r.id,
                documentation: r.content,
                relevance: r.similarity,
            }));
        }
        // Direct file lookup
        else if (query.file) {
            const doc = this.getFileDocumentation(query.file);
            if (doc) {
                files.push({ file: query.file, documentation: doc });
            }
        }
        // All files
        else {
            files = this.getAllFileContexts();
        }

        // Get recent changes
        const gitState = await this.gitService.getGitState();
        const recentChanges = gitState.recentCommit
            ? `Recent commit: "${gitState.recentCommit.message}" by ${gitState.recentCommit.author_name}`
            : undefined;

        return {
            summary: this.generateSummary(files),
            files,
            recentChanges,
        };
    }

    private getFileDocumentation(file: string): string | null {
        const basename = path.basename(file, path.extname(file));
        const docPath = path.join(this.wikiDir, 'memory', `${basename}.md`);

        if (fs.existsSync(docPath)) {
            return fs.readFileSync(docPath, 'utf-8');
        }
        return null;
    }

    private getAllFileContexts(): FileContext[] {
        const memoryDir = path.join(this.wikiDir, 'memory');
        if (!fs.existsSync(memoryDir)) return [];

        const files = fs.readdirSync(memoryDir);
        return files
            .filter(f => f.endsWith('.md'))
            .map(f => ({
                file: f.replace('.md', ''),
                documentation: fs.readFileSync(path.join(memoryDir, f), 'utf-8'),
            }));
    }

    private generateSummary(files: FileContext[]): string {
        const count = files.length;
        if (count === 0) return 'No documentation found.';
        if (count === 1) return `Documentation for ${files[0].file}`;
        return `Documentation for ${count} files`;
    }

    formatForLLM(context: FormattedContext): string {
        let formatted = `# Codebase Context\n\n${context.summary}\n\n`;

        if (context.recentChanges) {
            formatted += `## Recent Changes\n${context.recentChanges}\n\n`;
        }

        formatted += `## Files\n\n`;
        for (const file of context.files) {
            formatted += `### ${file.file}\n`;
            if (file.relevance) {
                formatted += `*Relevance: ${(file.relevance * 100).toFixed(1)}%*\n\n`;
            }
            formatted += `${file.documentation}\n\n---\n\n`;
        }

        return formatted;
    }
}
