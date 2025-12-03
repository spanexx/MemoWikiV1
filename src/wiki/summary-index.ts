import * as fs from 'fs';
import * as path from 'path';

export interface SummaryEntry {
    id: string;
    timestamp: number;
    type: 'feature' | 'bugfix' | 'refactor';
    files: string[];
    summaryPath: string;
    linkedTo?: string;
    tags?: string[];
}

interface IndexData {
    entries: SummaryEntry[];
}

export class SummaryIndex {
    private indexPath: string;

    constructor(wikiDir: string) {
        this.indexPath = path.join(wikiDir, 'summaries', 'index.json');
    }

    async addEntry(entry: SummaryEntry): Promise<void> {
        const index = this.loadIndex();
        index.entries.push(entry);
        this.saveIndex(index);
    }

    async getEntries(filter?: {
        type?: string;
        file?: string;
        linkedTo?: string;
    }): Promise<SummaryEntry[]> {
        const index = this.loadIndex();
        let entries = index.entries;

        if (filter) {
            if (filter.type) {
                entries = entries.filter(e => e.type === filter.type);
            }
            if (filter.file) {
                entries = entries.filter(e =>
                    e.files.some(f => f.includes(filter.file!))
                );
            }
            if (filter.linkedTo) {
                entries = entries.filter(e => e.linkedTo === filter.linkedTo);
            }
        }

        return entries.sort((a, b) => b.timestamp - a.timestamp);
    }

    async getRecent(limit: number = 10): Promise<SummaryEntry[]> {
        const index = this.loadIndex();
        return index.entries
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    async linkSummaries(parentId: string, childId: string): Promise<void> {
        const index = this.loadIndex();
        const child = index.entries.find(e => e.id === childId);

        if (child) {
            child.linkedTo = parentId;
            this.saveIndex(index);
        }
    }

    private loadIndex(): IndexData {
        if (fs.existsSync(this.indexPath)) {
            try {
                const data = fs.readFileSync(this.indexPath, 'utf-8');
                return JSON.parse(data);
            } catch (err) {
                console.warn('Failed to load index, creating new');
            }
        }

        return { entries: [] };
    }

    private saveIndex(index: IndexData): void {
        const dir = path.dirname(this.indexPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2));
    }
}
