export interface OverviewStats {
    filesDocumented: number;
    cacheHitRate: number;
    summariesCreated: number;
    pendingTodos: number;
    lastUpdate: string;
}

export interface Activity {
    id: string;
    type: 'documentation' | 'summary' | 'search' | 'git';
    message: string;
    timestamp: string;
    icon?: string;
}
