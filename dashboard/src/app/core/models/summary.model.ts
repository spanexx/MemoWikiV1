export type SummaryType = 'feature' | 'bugfix' | 'refactor' | 'other';

export interface SummaryEntry {
    id: string;
    type: SummaryType;
    title: string;
    description: string;
    filesIncluded: string[];
    todos: string[];
    stubs: string[];
    createdAt: string;
    agentName?: string;
}

export interface SummaryFilters {
    type?: SummaryType;
    dateFrom?: string;
    dateTo?: string;
    searchText?: string;
}
