import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon || '📭' }}</div>
      <h3>{{ title || 'No Data' }}</h3>
      <p>{{ message || 'No items to display' }}</p>
    </div>
  `,
    styles: [`
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #999;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h3 {
      margin: 0 0 0.5rem 0;
      color: #666;
    }

    p {
      margin: 0;
    }
  `]
})
export class EmptyStateComponent {
    @Input() icon?: string;
    @Input() title?: string;
    @Input() message?: string;
}
