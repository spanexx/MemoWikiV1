import { SummaryIndex, SummaryEntry } from './summary-index';
import * as path from 'path';

export class SummaryRetriever {
    private index: SummaryIndex;

    constructor(wikiDir: string) {
        this.index = new SummaryIndex(wikiDir);
    }

    async getByFile(filePath: string): Promise<SummaryEntry[]> {
        return this.index.getEntries({ file: filePath });
    }

    async getByType(type: 'feature' | 'bugfix' | 'refactor'): Promise<SummaryEntry[]> {
        return this.index.getEntries({ type });
    }

    async getRecent(limit: number = 10): Promise<SummaryEntry[]> {
        return this.index.getRecent(limit);
    }

    async search(query: string): Promise<SummaryEntry[]> {
        const entries = await this.index.getEntries();
        const lowerQuery = query.toLowerCase();

        return entries.filter(entry =>
            entry.id.toLowerCase().includes(lowerQuery) ||
            entry.files.some(f => f.toLowerCase().includes(lowerQuery)) ||
            (entry.tags && entry.tags.some(t => t.toLowerCase().includes(lowerQuery)))
        );
    }
}
