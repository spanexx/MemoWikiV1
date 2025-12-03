import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quick-actions">
      <h3>⚡ Quick Actions</h3>
      <div class="actions-grid">
        <button *ngFor="let action of actions" 
                (click)="handleAction(action.route)" 
                class="action-btn">
          <span class="action-icon">{{ action.icon }}</span>
          <span class="action-label">{{ action.label }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .quick-actions {
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

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem 1rem;
      background: var(--primary);
      color: var(--primary-foreground);
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .action-btn:hover {
      background: var(--accent);
      color: var(--accent-foreground);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .action-icon {
      font-size: 2rem;
    }

    .action-label {
      text-align: center;
    }
  `]
})
export class QuickActionsComponent {
  actions = [
    { icon: '🔄', label: 'Update Docs', route: '/documentation' },
    { icon: '📝', label: 'Record Summary', route: '/summaries' },
    { icon: '🔍', label: 'Search Code', route: '/search' },
    { icon: '🤖', label: 'Manage LLM', route: '/settings' }
  ];

  constructor(private router: Router) { }

  handleAction(route: string): void {
    this.router.navigate([route]);
  }
}
