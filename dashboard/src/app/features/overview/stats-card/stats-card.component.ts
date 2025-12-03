import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card">
      <div class="stats-icon">{{ icon }}</div>
      <div class="stats-content">
        <div class="stats-value">{{ value }}</div>
        <div class="stats-label">{{ label }}</div>
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stats-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .stats-icon {
      font-size: 2.5rem;
    }

    .stats-content {
      flex: 1;
    }

    .stats-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--foreground);
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stats-label {
      font-size: 0.875rem;
      color: var(--muted-foreground);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `]
})
export class StatsCardComponent {
  @Input() icon: string = '📊';
  @Input() value: string | number = '0';
  @Input() label: string = '';
}
