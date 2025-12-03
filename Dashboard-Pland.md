# MemoWiki Dashboard - Implementation Plan

## Overview

A local Angular web dashboard for MemoWiki that provides visual insights, management interface, and real-time monitoring of documentation generation, agent summaries, and codebase analysis.

## Dashboard Features

### 1. Overview Dashboard (Home)

**Key Metrics Cards:**
```
┌─────────────────────────────────────────────────────────┐
│  📊 Statistics Overview                                  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │   520    │  │   85%    │  │   45     │  │   12     ││
│  │  Files   │  │  Cache   │  │ Summaries│  │  TODOs   ││
│  │Documented│  │ Hit Rate │  │  Created │  │ Pending  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
└─────────────────────────────────────────────────────────┘
```

**Quick Actions Bar:**
- 🔄 Update Documentation
- 📝 Record Summary
- 🔍 Search Code
- 📊 Analyze Repository
- 🤖 **Manage LLM** (Configure providers and keys)
- ⚙️ Settings

**Activity Feed:**
- Recent documentation updates
- Latest agent summaries
- Recent searches
- Git activity

**Charts & Visualizations:**
- Documentation coverage pie chart (documented vs undocumented files)
- Update frequency line chart (last 30 days)
- Summary type distribution (features, bugfixes, refactors)
- LLM usage by provider bar chart

### 2. Documentation Manager

**File Browser:**
```
┌─────────────────────────────────────────────────────────┐
│  📁 Files                                   Status  Date │
├─────────────────────────────────────────────────────────┤
│  📄 src/auth/login.ts                      ✅  2h ago   │
│  📄 src/auth/register.ts                   ✅  2h ago   │
│  📄 src/services/payment.ts                ⚠️  Stale    │
│  📄 src/utils/helpers.ts                   ❌  Missing  │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Tree view of project files
- Documentation status indicators
- Last updated timestamps
- Quick actions (view, regenerate, delete)
- Filter by status (documented, stale, missing)
- Search files

**Documentation Viewer:**
- Split view: code on left, docs on right
- Mermaid diagram rendering
- Markdown preview
- Export options (PDF, HTML)

### 3. Agent Summaries

**Summary Timeline:**
```
┌─────────────────────────────────────────────────────────┐
│  📅 Timeline                                             │
├─────────────────────────────────────────────────────────┤
│  2025-12-02  🟢 Feature: Authentication (3 files)       │
│  2025-12-01  🔴 Bugfix: Login error (1 file)            │
│  2025-12-01  🔵 Refactor: Service layer (5 files)       │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Filterable timeline (by type, date, file)
- Summary cards with metadata
- TODO aggregation across all summaries
- Stub detection visualization
- Search summaries
- Export summaries

**Summary Detail View:**
- Full markdown rendering
- Files included
- TODOs with checkboxes
- Stubs highlighted
- Integration points
- Link to related summaries

### 4. Git Insights

**Repository Status:**
- Current branch with visual badge
- Ahead/behind indicator with arrows
- Modified/created/deleted file counts
- Recent commits list (last 10)
- Conflict warnings

**Branch Visualization:**
- Branch tree diagram
- Commit history graph
- File change heatmap
- Contributor activity

**Change Detection:**
- Real-time file change monitoring
- Auto-suggest documentation updates
- Uncommitted changes warning

### 5. Search Interface

**Semantic Search:**
```
┌─────────────────────────────────────────────────────────┐
│  🔍 Search your codebase...                             │
├─────────────────────────────────────────────────────────┤
│  Results for "authentication logic"                     │
│                                                          │
│  📄 src/auth/login.ts                          [95.2%] │
│     authenticateUser function                           │
│     "Validates credentials and generates JWT..."        │
│                                                          │
│  📄 src/auth/middleware.ts                     [87.3%] │
│     verifyToken function                                │
│     "Extracts and validates JWT from headers..."        │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Autocomplete suggestions
- Recent searches
- Filter by file type
- Sort by relevance
- Highlight matched text
- Jump to code location

### 6. Analytics & Reports

**Documentation Coverage Report:**
- Coverage percentage by directory
- Recently updated files
- Stale documentation alerts
- Undocumented files list

**LLM Usage Analytics:**
- API calls by provider
- Token usage tracking
- Cost estimation
- Cache efficiency metrics
- Response time analytics

**Agent Work Report:**
- Summaries created over time
- TODO completion rate
- Stub reduction tracking
- Implementation velocity

### 7. LLM Management & Settings

**LLM Provider Configuration:**

```
┌─────────────────────────────────────────────────────────┐
│  🤖 LLM Provider Configuration                          │
├─────────────────────────────────────────────────────────┤
│  Configuration Source:                                  │
│  ○ Use .env file (read-only)                           │
│  ● Manage from dashboard                                │
│                                                          │
│  Provider: [OpenAI        ▼]                           │
│                                                          │
│  ┌─── OpenAI Configuration ────────────────────────┐   │
│  │  API Key: ●●●●●●●●●●●●●●●●sk-abc [👁️] [Edit]    │   │
│  │  Model:   [gpt-4-turbo-preview ▼]               │   │
│  │  Status:  ✅ Connected                           │   │
│  │  [Test Connection]  [Save]                       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Available Providers:                                   │
│  ✅ OpenAI      (Configured)                            │
│  ✅ Anthropic   (Configured)                            │
│  ⚠️  Gemini     (API key missing)                       │
│  ❌ OpenRouter  (Not configured)                        │
│  ✅ Ollama      (Local - Running)                       │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Dual Configuration Mode:**
  - Read from `.env` file (default)
  - Override from dashboard (stored in `.memowiki/config.json`)
- **Provider Cards:**
  - Visual status indicators
  - Quick switch between providers
  - Model selection dropdown
  - API key management with masking
  - Test connection button
  - Usage statistics per provider
- **API Key Security:**
  - Masked display (`●●●●●●sk-abc`)
  - Toggle visibility
  - Secure storage (encrypted in config file)
  - Never sent to frontend logs
- **Model Management:**
  - Dropdown with available models per provider
  - Model descriptions and pricing info
  - Performance recommendations
  - Custom model support (for Ollama, OpenRouter)
- **Connection Testing:**
  - Real-time validation
  - Error messages with troubleshooting
  - Latency measurement
  - Cost estimate calculator

**Configuration UI Mockup:**

```typescript
// Provider card component
┌───────────────────────────────────┐
│ 🟢 OpenAI                         │
│ Current Provider                  │
├───────────────────────────────────┤
│ Model: gpt-4-turbo-preview       │
│ API Key: ●●●●●●sk-abc [Edit]     │
│ Status: ✅ Connected (23ms)       │
│                                   │
│ Usage This Month:                 │
│ • 1,245 requests                  │
│ • ~$12.45 estimated               │
│ • 85% cache hit rate              │
│                                   │
│ [Configure] [Test] [Set Default] │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│ ⚪ Anthropic                      │
├───────────────────────────────────┤
│ Model: claude-3-5-sonnet         │
│ API Key: Not configured          │
│ Status: ❌ Not configured         │
│                                   │
│ [Add API Key]                     │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│ 🟢 Ollama (Local)                │
├───────────────────────────────────┤
│ Model: llama2                    │
│ URL: http://localhost:11434      │
│ Status: ✅ Running                │
│                                   │
│ Available Models:                 │
│ • llama2 (7B)                    │
│ • codellama (13B)                │
│ • mistral (7B)                   │
│                                   │
│ [Pull Model] [Configure]         │
└───────────────────────────────────┘
```

**Add/Edit Provider Modal:**

```
┌─────────────────────────────────────────────────────────┐
│  Configure OpenAI                                [X]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  API Key *                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ sk-proj-abc123...                              │   │
│  └─────────────────────────────────────────────────┘   │
│  [?] Get API key from OpenAI Platform                  │
│                                                          │
│  Model *                                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ gpt-4-turbo-preview                        ▼  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ├─ gpt-4-turbo-preview ($10/1M tokens)                │
│  ├─ gpt-4 ($30/1M tokens)                              │
│  ├─ gpt-3.5-turbo ($2/1M tokens) [Fastest]            │
│  └─ gpt-4o [Latest]                                    │
│                                                          │
│  Advanced Options                              [▼]     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Max Retries: [3]                              │   │
│  │ Timeout: [30s]                                │   │
│  │ Temperature: [0.7]                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ☑ Save to dashboard config (.memowiki/config.json)   │
│  ☐ Update .env file                                    │
│                                                          │
│  [Test Connection]         [Cancel]  [Save]            │
└─────────────────────────────────────────────────────────┘
```

**Documentation Settings:**
- Auto-update on file save toggle
- Cache settings (TTL, max size)
- Excluded file patterns (glob)
- Output preferences (format, location)
- Diagram generation toggle

**Search Settings:**
- ChromaDB connection URL
- Enable/disable semantic search
- Index rebuild button with progress
- Embedding model selection
- Search result limit

**Dashboard Preferences:**
- Theme (light/dark/auto)
- Default view on startup
- Auto-refresh intervals
- Notification preferences
- Export settings (PDF, HTML)

---

## Technical Architecture

### Frontend Stack

**Core Framework:**
```typescript
Angular 17+
TypeScript 5.0+
RxJS 7.8+
```

**UI Components:**
```typescript
Angular Material 17
Chart.js / ng2-charts
ngx-markdown (Markdown rendering)
mermaid (Diagram rendering)
@angular/cdk (Drag & drop, virtual scrolling)
```

**State Management:**
```typescript
NgRx (Redux pattern)
  - Store: Centralized state
  - Effects: Side effects & API calls
  - Selectors: Derived state
```

### Project Structure

```
memowiki-dashboard/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts           # HTTP client wrapper
│   │   │   │   ├── websocket.service.ts     # Real-time updates
│   │   │   │   └── auth.service.ts          # (Future) Auth
│   │   │   ├── guards/
│   │   │   │   └── connection.guard.ts      # Check API availability
│   │   │   ├── interceptors/
│   │   │   │   └── error.interceptor.ts     # Global error handling
│   │   │   └── models/
│   │   │       ├── file.model.ts
│   │   │       ├── summary.model.ts
│   │   │       ├── git-state.model.ts
│   │   │       └── search-result.model.ts
│   │   ├── features/
│   │   │   ├── overview/
│   │   │   │   ├── overview.component.ts
│   │   │   │   ├── stats-card/
│   │   │   │   ├── activity-feed/
│   │   │   │   └── charts/
│   │   │   ├── documentation/
│   │   │   │   ├── file-browser/
│   │   │   │   ├── doc-viewer/
│   │   │   │   └── diagram-viewer/
│   │   │   ├── summaries/
│   │   │   │   ├── timeline/
│   │   │   │   ├── summary-card/
│   │   │   │   └── summary-detail/
│   │   │   ├── git/
│   │   │   │   ├── status/
│   │   │   │   ├── branch-tree/
│   │   │   │   └── commit-history/
│   │   │   ├── search/
│   │   │   │   ├── search-bar/
│   │   │   │   └── results-list/
│   │   │   ├── analytics/
│   │   │   │   ├── coverage-report/
│   │   │   │   └── usage-charts/
│   │   │   └── settings/
│   │   │       ├── llm-config/
│   │   │       └── preferences/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── loading-spinner/
│   │   │   │   ├── error-message/
│   │   │   │   └── empty-state/
│   │   │   ├── pipes/
│   │   │   │   ├── relative-time.pipe.ts
│   │   │   │   └── highlight.pipe.ts
│   │   │   └── directives/
│   │   │       └── auto-refresh.directive.ts
│   │   └── store/
│   │       ├── app.state.ts
│   │       ├── documentation/
│   │       │   ├── documentation.actions.ts
│   │       │   ├── documentation.reducer.ts
│   │       │   ├── documentation.effects.ts
│   │       │   └── documentation.selectors.ts
│   │       ├── summaries/
│   │       ├── git/
│   │       └── search/
│   ├── assets/
│   │   ├── icons/
│   │   └── themes/
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
├── angular.json
├── package.json
└── tsconfig.json
```

### Backend API Enhancements

**New Endpoints for Dashboard:**

```typescript
// Overview statistics
GET /api/v1/stats/overview
Response: {
  filesDocumented: number;
  cacheHitRate: number;
  summariesCreated: number;
  pendingTodos: number;
  lastUpdate: string;
}

// File status list
GET /api/v1/files/status
Response: {
  files: Array<{
    path: string;
    status: 'documented' | 'stale' | 'missing';
    lastUpdated: string;
    hasCache: boolean;
  }>;
}

// Analytics data
GET /api/v1/analytics/coverage
GET /api/v1/analytics/llm-usage
GET /api/v1/analytics/activity?days=30

// LLM Configuration Management
GET /api/v1/config/llm
Response: {
  source: 'env' | 'dashboard';
  currentProvider: 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'ollama' | 'mock';
  providers: Array<{
    name: string;
    configured: boolean;
    status: 'connected' | 'error' | 'unconfigured';
    model?: string;
    latency?: number;
    usage?: {
      requests: number;
      estimatedCost: number;
      cacheHitRate: number;
    };
  }>;
}

PUT /api/v1/config/llm
Request: {
  source: 'env' | 'dashboard';
  provider: string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  options?: {
    maxRetries?: number;
    timeout?: number;
    temperature?: number;
  };
}

POST /api/v1/config/llm/test
Request: {
  provider: string;
  apiKey: string;
  model?: string;
}
Response: {
  success: boolean;
  latency?: number;
  error?: string;
}

GET /api/v1/config/llm/providers/:provider/models
Response: {
  models: Array<{
    id: string;
    name: string;
    description: string;
    pricing?: string;
    contextWindow?: number;
  }>;
}

// Real-time updates via WebSocket
WS /api/v1/ws
Events:
  - file:updated
  - summary:created
  - git:changed
  - cache:cleared
  - config:changed
```

**Enhanced API Service:**

```typescript
// src/builder/api/dashboard.service.ts
export class DashboardService {
  async getOverviewStats(): Promise<OverviewStats>;
  async getFileStatuses(): Promise<FileStatus[]>;
  async getCoverageAnalytics(): Promise<CoverageData>;
  async getLLMUsageAnalytics(): Promise<LLMUsageData>;
  async getActivityFeed(days: number): Promise<Activity[]>;
}
```

### State Management (NgRx)

**Store Structure:**

```typescript
interface AppState {
  documentation: {
    files: FileStatus[];
    selectedFile: File | null;
    loading: boolean;
    error: string | null;
  };
  summaries: {
    entries: SummaryEntry[];
    selectedSummary: SummaryEntry | null;
    filters: SummaryFilters;
    loading: boolean;
  };
  git: {
    status: GitState;
    commits: Commit[];
    loading: boolean;
  };
  search: {
    query: string;
    results: SearchResult[];
    loading: boolean;
  };
  settings: {
    config: Config;
    theme: 'light' | 'dark';
    autoRefresh: boolean;
  };
}
```

**Actions Example:**

```typescript
// Documentation actions
export const loadFiles = createAction('[Documentation] Load Files');
export const loadFilesSuccess = createAction(
  '[Documentation] Load Files Success',
  props<{ files: FileStatus[] }>()
);
export const updateFile = createAction(
  '[Documentation] Update File',
  props<{ filePath: string }>()
);
```

### Real-Time Updates

**WebSocket Integration:**

```typescript
// websocket.service.ts
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  connect(): void {
    this.socket$ = webSocket('ws://localhost:3000/api/v1/ws');
    
    this.socket$.subscribe(
      (message) => this.handleMessage(message),
      (error) => console.error(error)
    );
  }

  private handleMessage(message: any): void {
    switch (message.type) {
      case 'file:updated':
        this.store.dispatch(fileUpdated({ file: message.data }));
        break;
      case 'summary:created':
        this.store.dispatch(summaryCreated({ summary: message.data }));
        break;
    }
  }
}
```

### Routing Configuration

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { 
    path: 'overview', 
    component: OverviewComponent,
    canActivate: [ConnectionGuard]
  },
  { 
    path: 'documentation', 
    loadChildren: () => import('./features/documentation/documentation.module')
  },
  { 
    path: 'summaries', 
    loadChildren: () => import('./features/summaries/summaries.module')
  },
  { path: 'git', component: GitInsightsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/overview' }
];
```

---

## Implementation Plan

### Phase 1: MVP (Weeks 1-2)

**Backend:**
- [ ] Add dashboard statistics endpoints
- [ ] Add file status endpoint
- [ ] Enhance `/serve` command to serve Angular app
- [ ] Add CORS configuration

**Frontend:**
- [ ] Angular project setup with Material
- [ ] Basic routing and navigation
- [ ] Overview dashboard with stats cards
- [ ] File browser with status
- [ ] Summary timeline
- [ ] LLM configuration UI (Quick Action)
- [ ] Settings page

**Deliverables:**
- Working dashboard accessible at `http://localhost:4200`
- Basic statistics display
- File and summary viewing

### Phase 2: Enhanced Features (Weeks 3-4)

**Backend:**
- [ ] WebSocket server for real-time updates
- [ ] Analytics endpoints (coverage, usage)
- [ ] Activity feed endpoint
- [ ] LLM config management endpoints
- [ ] Configuration file encryption

**Frontend:**
- [ ] NgRx state management
- [ ] Real-time updates via WebSocket
- [ ] Charts and visualizations
- [ ] Advanced filtering and sorting
- [ ] Search interface
- [ ] Provider cards with status
- [ ] API key management UI
- [ ] Model selection dropdowns

**Deliverables:**
- Real-time dashboard updates
- Data visualizations
- Advanced search

### Phase 3: Advanced Features (Weeks 5-6)

**Backend:**
- [ ] Git insights endpoints
- [ ] Batch operations (bulk update, delete)
- [ ] Export functionality

**Frontend:**
- [ ] Git visualization (branch tree, commit graph)
- [ ] Documentation viewer with split view
- [ ] Mermaid diagram rendering
- [ ] Export features (PDF, HTML)
- [ ] Dark mode

**Deliverables:**
- Complete git integration
- Advanced documentation viewer
- Full feature set

### Phase 4: Polish & Optimization (Week 7)

- [ ] Performance optimization
- [ ] Responsive design for tablets
- [ ] Error handling and loading states
- [ ] User preferences persistence
- [ ] Comprehensive testing
- [ ] Documentation

---

## Development Workflow

### 1. Setup

```bash
# Create Angular app
ng new memowiki-dashboard --routing --style=scss

# Install dependencies
cd memowiki-dashboard
npm install @angular/material @ngrx/store @ngrx/effects
npm install chart.js ng2-charts
npm install ngx-markdown mermaid
npm install socket.io-client

# Start backend API
cd ../MemoWikiV1
npm run serve

# Start Angular dev server
cd ../memowiki-dashboard
ng serve
```

### 2. Development

```bash
# Generate components
ng g c features/overview
ng g c features/documentation/file-browser
ng g c shared/components/stats-card

# Generate services
ng g s core/services/api
ng g s core/services/websocket

# Run with API proxy
ng serve --proxy-config proxy.conf.json
```

**Proxy Configuration (`proxy.conf.json`):**
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  },
  "/ws": {
    "target": "ws://localhost:3000",
    "ws": true
  }
}
```

### 3. Build & Deployment

```bash
# Build for production
ng build --configuration production

# Output to backend static folder
ng build --output-path ../MemoWikiV1/dist/dashboard

# Backend serves dashboard
# Access at http://localhost:3000/
```

---

## Key Components Implementation

### Overview Component

```typescript
@Component({
  selector: 'app-overview',
  template: `
    <div class="overview-container">
      <app-stats-cards [stats]="stats$ | async"></app-stats-cards>
      <app-quick-actions></app-quick-actions>
      <div class="row">
        <app-activity-feed [activities]="activities$ | async"></app-activity-feed>
        <app-coverage-chart [data]="coverage$ | async"></app-coverage-chart>
      </div>
    </div>
  `
})
export class OverviewComponent implements OnInit {
  stats$ = this.store.select(selectOverviewStats);
  activities$ = this.store.select(selectRecentActivities);
  coverage$ = this.store.select(selectCoverageData);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadOverviewData());
  }
}
```

### File Browser Component

```typescript
@Component({
  selector: 'app-file-browser',
  template: `
    <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
        <mat-icon [class]="getStatusClass(node.status)">
          {{ getStatusIcon(node.status) }}
        </mat-icon>
        <span>{{ node.name }}</span>
        <span class="spacer"></span>
        <span class="timestamp">{{ node.lastUpdated | relativeTime }}</span>
      </mat-tree-node>
    </mat-tree>
  `
})
export class FileBrowserComponent {
  dataSource: MatTreeDataSource<FileNode>;
  treeControl: FlatTreeControl<FileNode>;
  
  getStatusClass(status: string): string {
    return {
      'documented': 'status-success',
      'stale': 'status-warning',
      'missing': 'status-error'
    }[status];
  }
}
```

---

## User Experience

### Responsive Design
- Desktop: Full sidebar navigation
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation (future)

### Performance
- Virtual scrolling for large file lists
- Lazy loading of routes
- Pagination for summaries (50 per page)
- Debounced search (300ms)

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support

---

## Benefits

### For Developers
- **Visual Insights** - See documentation status at a glance
- **Productivity** - Quick access to all MemoWiki features
- **Monitoring** - Real-time updates and notifications
- **Analytics** - Track documentation coverage and LLM usage

### For AI Agents
- **Dashboard API** - Programmatic access to all features
- **Real-time Data** - Subscribe to updates via WebSocket
- **Batch Operations** - Process multiple files efficiently
- **Visual Feedback** - See impact of agent work

### For Teams
- **Collaboration** - Shared documentation status
- **Reporting** - Export analytics and coverage reports
- **Transparency** - See who documented what and when
- **Efficiency** - Reduce time finding documentation

---

## Future Enhancements

- **Multi-Project Support** - Switch between projects
- **User Authentication** - Team collaboration
- **Notifications** - Browser notifications for updates
- **Custom Dashboards** - Drag-and-drop widgets
- **AI Chat Interface** - Ask questions about codebase
- **Integration Hub** - Connect to Jira, Slack, etc.
- **Mobile App** - Native iOS/Android apps