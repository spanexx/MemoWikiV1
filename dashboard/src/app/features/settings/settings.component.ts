import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardApiService } from '../../core/services/dashboard-api.service';
import { LLMConfig, LLMProviderConfig, LLMProvider } from '../../core/models/llm-config.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';

interface ProviderEdit {
  apiKey?: string;
  model?: string;
  showApiKey?: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  config: LLMConfig | null = null;
  loading = false;
  error: string | null = null;
  theme: 'light' | 'dark' | 'auto' = 'light';

  // Edit mode state
  editMode: Record<string, ProviderEdit> = {};
  testingConnection: string | null = null;
  savingConfig = false;

  constructor(private dashboardApi: DashboardApiService) { }

  ngOnInit(): void {
    this.loadConfig();
    this.loadTheme();
  }

  loadTheme(): void {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto';
    this.theme = savedTheme || 'light';
    this.applyTheme(this.theme);
  }

  onThemeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.theme = select.value as 'light' | 'dark' | 'auto';
    localStorage.setItem('theme', this.theme);
    this.applyTheme(this.theme);
  }

  private applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const root = document.documentElement;

    if (theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  loadConfig(): void {
    this.loading = true;
    this.error = null;

    this.dashboardApi.getLLMConfig().subscribe({
      next: (config) => {
        this.config = config;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load LLM configuration';
        this.loading = false;
        console.error('Error loading config:', err);
      }
    });
  }

  toggleConfigSource(): void {
    if (!this.config) return;

    const newSource = this.config.source === 'env' ? 'dashboard' : 'env';
    this.savingConfig = true;

    this.dashboardApi.updateLLMConfig({ source: newSource }).subscribe({
      next: (result: any) => {
        if (this.config) {
          this.config.source = newSource;
        }
        this.savingConfig = false;
      },
      error: (err) => {
        console.error('Failed to update config source:', err);
        this.savingConfig = false;
      }
    });
  }

  isEditable(): boolean {
    return this.config?.source === 'dashboard';
  }

  startEdit(providerName: string): void {
    const provider = this.config?.providers.find(p => p.name === providerName);
    if (!provider) return;

    this.editMode[providerName] = {
      apiKey: '',
      model: provider.model,
      showApiKey: false
    };
  }

  cancelEdit(providerName: string): void {
    delete this.editMode[providerName];
  }

  isEditing(providerName: string): boolean {
    return !!this.editMode[providerName];
  }

  toggleApiKeyVisibility(providerName: string): void {
    if (this.editMode[providerName]) {
      this.editMode[providerName].showApiKey = !this.editMode[providerName].showApiKey;
    }
  }

  testConnection(providerName: string): void {
    this.testingConnection = providerName;
    const edit = this.editMode[providerName];

    this.dashboardApi.testLLMConnection(
      providerName as LLMProvider,
      edit?.apiKey || '',
      edit?.model
    ).subscribe({
      next: (result) => {
        console.log('Connection test result:', result);
        this.testingConnection = null;
        // Show success message (TODO: add toast notification)
      },
      error: (err) => {
        console.error('Connection test failed:', err);
        this.testingConnection = null;
        // Show error message (TODO: add toast notification)
      }
    });
  }

  saveProvider(providerName: string): void {
    const edit = this.editMode[providerName];
    if (!edit) return;

    this.savingConfig = true;

    const updates: any = {};
    updates[providerName] = {
      apiKey: edit.apiKey,
      model: edit.model
    };

    this.dashboardApi.updateLLMConfig(updates).subscribe({
      next: (result: any) => {
        this.config = result.config;
        delete this.editMode[providerName];
        this.savingConfig = false;
      },
      error: (err) => {
        console.error('Failed to save provider config:', err);
        this.savingConfig = false;
      }
    });
  }

  setDefaultProvider(provider: LLMProvider): void {
    this.savingConfig = true;

    this.dashboardApi.updateLLMConfig({ provider }).subscribe({
      next: (result: any) => {
        if (this.config) {
          this.config.currentProvider = provider;
        }
        this.savingConfig = false;
      },
      error: (err) => {
        console.error('Failed to set default provider:', err);
        this.savingConfig = false;
      }
    });
  }

  formatProviderName(name: string): string {
    const names: Record<string, string> = {
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      gemini: 'Gemini',
      openrouter: 'OpenRouter',
      ollama: 'Ollama'
    };
    return names[name] || name.charAt(0).toUpperCase() + name.slice(1);
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      connected: '🟢',
      error: '🔴',
      unconfigured: '⚪'
    };
    return icons[status] || '⚪';
  }

  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      connected: 'Connected',
      error: 'Error',
      unconfigured: 'Not Configured'
    };
    return texts[status] || status;
  }
}
