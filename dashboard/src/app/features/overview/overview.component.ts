import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';
import { QuickActionsComponent } from './quick-actions/quick-actions.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { DashboardApiService } from '../../core/services/dashboard-api.service';
import { OverviewStats, Activity } from '../../core/models/overview-stats.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardComponent,
    ActivityFeedComponent,
    QuickActionsComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  template: `
    <div class="overview-container">
      <header class="page-header">
        <h1>📊 Dashboard Overview</h1>
        <p>Welcome to MemoWiki Dashboard</p>
      </header>

      <app-loading-spinner *ngIf="loading" />
      <app-error-message 
        *ngIf="error" 
        [message]="error" 
        [onRetry]="loadData.bind(this)" 
      />

      <div *ngIf="!loading && !error" class="content">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <app-stats-card 
            icon="📄" 
            [value]="stats?.filesDocumented || 0" 
            label="Files Documented"
          />
          <app-stats-card 
            icon="⚡" 
            [value]="formatPercent(stats?.cacheHitRate)" 
            label="Cache Hit Rate"
          />
          <app-stats-card 
            icon="📋" 
            [value]="stats?.summariesCreated || 0" 
            label="Summaries Created"
          />
          <app-stats-card 
            icon="✅" 
            [value]="stats?.pendingTodos || 0" 
            label="Pending TODOs"
          />
        </div>

        <!-- Quick Actions -->
        <app-quick-actions />

        <!-- Activity Feed -->
        <app-activity-feed [activities]="activities" />
      </div>
    </div>
  `,
  styles: [`
    .overview-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      font-family: var(--font-serif);
      color: var(--foreground);
    }

    .page-header p {
      margin: 0;
      color: var(--muted-foreground);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .content > * + * {
      margin-top: 2rem;
    }
  `]
})
export class OverviewComponent implements OnInit {
  stats: OverviewStats | null = null;
  activities: Activity[] = [];
  loading = false;
  error: string | null = null;

  constructor(private dashboardApi: DashboardApiService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Load stats
    this.dashboardApi.getOverviewStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics. Make sure the API server is running.';
        this.loading = false;
        console.error('Error loading stats:', err);
      }
    });

    // Load activity feed
    this.dashboardApi.getActivityFeed(7).subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (err) => {
        console.error('Error loading activity:', err);
      }
    });
  }

  formatPercent(value?: number): string {
    if (value === undefined) return '0%';
    return `${Math.round(value * 100)}%`;
  }
}
