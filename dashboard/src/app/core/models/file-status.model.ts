export type DocumentationStatus = 'documented' | 'stale' | 'missing';

export interface FileStatus {
    path: string;
    status: DocumentationStatus;
    lastUpdated: string;
    hasCache: boolean;
    size?: number;
    language?: string;
}
