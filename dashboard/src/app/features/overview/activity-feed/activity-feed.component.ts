import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../../core/models/overview-stats.model';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe],
  template: `
    <div class="activity-feed">
      <h3>📅 Recent Activity</h3>
      <div class="activity-list">
        <div *ngFor="let activity of activities" class="activity-item">
          <div class="activity-icon">{{ activity.icon || getDefaultIcon(activity.type) }}</div>
          <div class="activity-content">
            <p class="activity-message">{{ activity.message }}</p>
            <span class="activity-time">{{ activity.timestamp | relativeTime }}</span>
          </div>
        </div>
        <div *ngIf="!activities || activities.length === 0" class="empty">
          No recent activity
        </div>
      </div>
    </div>
  `,
  styles: [`
    .activity-feed {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    h3 {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      font-family: var(--font-serif);
      color: var(--foreground);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: calc(var(--radius) - 4px);
      transition: background 0.2s;
    }

    .activity-item:hover {
      background: var(--accent);
    }

    .activity-icon {
      font-size: 1.5rem;
    }

    .activity-content {
      flex: 1;
    }

    .activity-message {
      margin: 0 0 0.25rem 0;
      color: var(--foreground);
      font-size: 0.9rem;
    }

    .activity-time {
      font-size: 0.8rem;
      color: var(--muted-foreground);
    }

    .empty {
      text-align: center;
      padding: 2rem;
      color: var(--muted-foreground);
    }
  `]
})
export class ActivityFeedComponent {
  @Input() activities: Activity[] = [];

  getDefaultIcon(type: string): string {
    const icons: Record<string, string> = {
      documentation: '📝',
      summary: '📋',
      search: '🔍',
      git: '🔄'
    };
    return icons[type] || '•';
  }
}
