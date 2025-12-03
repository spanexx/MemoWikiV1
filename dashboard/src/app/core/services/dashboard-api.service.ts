import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { OverviewStats, Activity } from '../models/overview-stats.model';
import { FileStatus } from '../models/file-status.model';
import { SummaryEntry } from '../models/summary.model';
import { LLMConfig, LLMConfigUpdate, LLMTestResponse, LLMModel, LLMProvider } from '../models/llm-config.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardApiService {
    constructor(private api: ApiService) { }

    // Overview Stats
    getOverviewStats(): Observable<OverviewStats> {
        return this.api.get<OverviewStats>('/stats/overview');
    }

    getActivityFeed(days: number = 7): Observable<Activity[]> {
        return this.api.get<Activity[]>(`/activity?days=${days}`);
    }

    // File Status
    getFileStatuses(): Observable<FileStatus[]> {
        return this.api.get<FileStatus[]>('/files/status');
    }

    // Summaries
    getSummaries(): Observable<SummaryEntry[]> {
        return this.api.get<SummaryEntry[]>('/summaries');
    }

    getSummary(id: string): Observable<SummaryEntry> {
        return this.api.get<SummaryEntry>(`/summaries/${id}`);
    }

    // LLM Configuration
    getLLMConfig(): Observable<LLMConfig> {
        return this.api.get<LLMConfig>('/config/llm');
    }

    updateLLMConfig(config: LLMConfigUpdate): Observable<LLMConfig> {
        return this.api.put<LLMConfig>('/config/llm', config);
    }

    testLLMConnection(provider: LLMProvider, apiKey: string, model?: string): Observable<LLMTestResponse> {
        return this.api.post<LLMTestResponse>('/config/llm/test', { provider, apiKey, model });
    }

    getProviderModels(provider: LLMProvider): Observable<{ models: LLMModel[] }> {
        return this.api.get<{ models: LLMModel[] }>(`/config/llm/providers/${provider}/models`);
    }
}
