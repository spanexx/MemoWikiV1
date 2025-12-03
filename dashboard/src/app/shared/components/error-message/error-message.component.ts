import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error-message',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="error-container" *ngIf="message">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h3>{{ title || 'Error' }}</h3>
        <p>{{ message }}</p>
        <button *ngIf="onRetry" (click)="onRetry()" class="retry-btn">
          Try Again
        </button>
      </div>
    </div>
  `,
    styles: [`
    .error-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .error-icon {
      font-size: 2rem;
    }

    .error-content h3 {
      margin: 0 0 0.5rem 0;
      color: #c33;
    }

    .error-content p {
      margin: 0 0 1rem 0;
      color: #666;
    }

    .retry-btn {
      padding: 0.5rem 1rem;
      background: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .retry-btn:hover {
      background: #303f9f;
    }
  `]
})
export class ErrorMessageComponent {
    @Input() message?: string;
    @Input() title?: string;
    @Input() onRetry?: () => void;
}
