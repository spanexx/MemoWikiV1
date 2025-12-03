import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardApiService } from '../../core/services/dashboard-api.service';
import { SummaryEntry } from '../../core/models/summary.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-summaries',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    EmptyStateComponent,
    RelativeTimePipe
  ],
  template: `
    <div class="summaries-container">
      <header class="page-header">
        <h1>📅 Agent Summaries Timeline</h1>
        <div class="header-actions">
          <input type="text" placeholder="Search summaries..." [(ngModel)]="searchTerm" (input)="filterSummaries()" class="search-input">
          <select [(ngModel)]="typeFilter" (change)="filterSummaries()" class="filter-select">
            <option value="">All Types</option>
            <option value="feature">Feature</option>
            <option value="bugfix">Bugfix</option>
            <option value="refactor">Refactor</option>
            <option value="other">Other</option>
          </select>
        </div>
      </header>

      <app-loading-spinner *ngIf="loading" />
      <app-error-message *ngIf="error" [message]="error" [onRetry]="loadSummaries.bind(this)" />

      <div *ngIf="!loading && !error" class="summaries-list">
        <app-empty-state 
          *ngIf="filteredSummaries.length === 0"
          icon="📋"
          title="No Summaries Found"
          message="No summaries match your search criteria"
        />

        <div *ngFor="let summary of filteredSummaries" class="summary-card">
          <div class="summary-header">
            <span class="type-badge" [class]="'type-' + summary.type">
              {{ getTypeIcon(summary.type) }} {{ summary.type }}
            </span>
            <span class="summary-date">{{ summary.createdAt | relativeTime }}</span>
          </div>
          <h3 class="summary-title">{{ summary.title }}</h3>
          <p class="summary-description">{{ summary.description }}</p>
          <div class="summary-meta">
            <span class="meta-item">📁 {{ summary.filesIncluded.length }} files</span>
            <span class="meta-item" *ngIf="summary.todos.length > 0">
              ✅ {{ summary.todos.length }} TODOs
            </span>
            <span class="meta-item" *ngIf="summary.stubs.length > 0">
              ⚠️ {{ summary.stubs.length }} stubs
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .summaries-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0 0 1rem 0;
      font-size: 2.5rem;
      font-family: var(--font-serif);
      color: var(--foreground);
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .search-input, .filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px);
      background: var(--background);
      color: var(--foreground);
      font-size: 0.95rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .search-input:focus, .filter-select:focus {
      outline: none;
      border-color: var(--ring);
      box-shadow: 0 0 0 3px oklch(from var(--ring) l c h / 0.1);
    }

    .search-input {
      flex: 1;
    }

    .filter-select {
      min-width: 150px;
    }

    .summaries-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .summary-card {
      background: var(--card);
      color: var(--card-foreground);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      transition: all 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary);
    }

    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .type-badge {
      padding: 0.375rem 0.75rem;
      border-radius: calc(var(--radius) - 4px);
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .type-feature {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .type-bugfix {
      background: #ffebee;
      color: #c62828;
    }

    .type-refactor {
      background: #e3f2fd;
      color: #1976d2;
    }

    .type-other {
      background: var(--muted);
      color: var(--muted-foreground);
    }

    .summary-date {
      font-size: 0.85rem;
      color: var(--muted-foreground);
      font-family: var(--font-mono);
    }

    .summary-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-family: var(--font-serif);
      color: var(--foreground);
    }

    .summary-description {
      margin: 0 0 1rem 0;
      color: var(--muted-foreground);
      line-height: 1.6;
    }

    .summary-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.85rem;
      color: var(--muted-foreground);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `]
})
export class SummariesComponent implements OnInit {
  summaries: SummaryEntry[] = [];
  filteredSummaries: SummaryEntry[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  typeFilter = '';

  constructor(private dashboardApi: DashboardApiService) { }

  ngOnInit(): void {
    this.loadSummaries();
  }

  loadSummaries(): void {
    this.loading = true;
    this.error = null;

    this.dashboardApi.getSummaries().subscribe({
      next: (summaries) => {
        this.summaries = summaries;
        this.filteredSummaries = summaries;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load summaries';
        this.loading = false;
        console.error('Error loading summaries:', err);
      }
    });
  }

  filterSummaries(): void {
    this.filteredSummaries = this.summaries.filter(summary => {
      const matchesSearch = !this.searchTerm ||
        summary.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        summary.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.typeFilter || summary.type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      feature: '🟢',
      bugfix: '🔴',
      refactor: '🔵',
      other: '⚪'
    };
    return icons[type] || '•';
  }
}
