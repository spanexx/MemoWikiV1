# Dashboard

## Overview

The MemoWiki Dashboard is a web-based interface for visualizing and managing your codebase documentation. Built with Angular 21, it provides real-time insights into your documentation status, agent activity, and LLM configuration.

## Features

### Overview Dashboard
- **Statistics Cards**: Quick view of documented files, cache hit rate, summaries created, and pending TODOs
- **Activity Feed**: Recent documentation updates, summaries, and git synchronization events
- **Quick Actions**: Navigate to key features with one click

### Documentation Browser
- **File List**: View all files with their documentation status
- **Status Filters**: Filter by documented, stale, or missing documentation
- **Search**: Quick search through file paths
- **Cache Indicators**: See which files have cached documentation

### Summaries Timeline
- **Chronological View**: All agent implementation summaries in reverse chronological order
- **Type Filters**: Filter by feature, bugfix, refactor, or other
- **Metadata**: View files included, TODOs, and stub indicators for each summary
- **Search**: Find specific summaries by title or description

### Settings
- **LLM Configuration**: View current provider and model settings
- **Provider Status**: See which providers are configured and connected
- **Usage Statistics**: Monitor API requests and estimated costs (per provider)
- **Quick Switching**: Change default provider (when implemented)

## Quick Start

### Building the Dashboard

```bash
# Build backend and dashboard together
npm run build:all

# Or build dashboard only
npm run build:dashboard
```

### Running the Dashboard

```bash
# Production mode (serve compiled dashboard)
npm run build:all
memowiki serve
# Access at http://localhost:3000
```

### Development Mode

For dashboard development with hot-reload:

```bash
# Terminal 1: Start backend API
memowiki serve

# Terminal 2: Start dashboard dev server
cd dashboard
npm start
# Access at http://localhost:4200
```

The dev server proxies API requests to `localhost:3000` via `proxy.conf.json`.

## Architecture

### Frontend Stack
- **Framework**: Angular 21 (standalone components)
- **UI Library**: Angular Material
- **State Management**: NgRx (planned for Phase 2)
- **Charts**: Chart.js + ng2-charts (planned)
- **Markdown**: ngx-markdown + marked
- **Diagrams**: Mermaid (planned)

### Backend Integration
The dashboard communicates with the MemoWiki backend via REST API:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/stats/overview` | Overview statistics |
| `GET /api/v1/files/status` | File documentation status |
| `GET /api/v1/summaries` | Agent summaries list |
| `GET /api/v1/activity?days=7` | Recent activity feed |
| `GET /api/v1/config/llm` | LLM configuration |

### Monorepo Structure
The dashboard is configured as a workspace within the main MemoWiki project:

```
MemoWikiV1/
├── dashboard/              # Angular dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/  # Main feature modules
│   │   │   ├── core/      # Services and models
│   │   │   └── shared/    # Reusable components
│   │   └── environments/
│   └── dist/              # Compiled output
├── src/                   # Backend TypeScript
├── node_modules/          # Shared dependencies
└── package.json           # Workspace configuration
```

## Development Workflow

### Making Changes

```bash
# 1. Make changes to dashboard code
# 2. Test with hot-reload
cd dashboard
npm start

# 3. Build for production
npm run build

# 4. Test production build
cd ..
memowiki serve
```

### Adding Features

1. **Create Models**: Define TypeScript interfaces in `src/app/core/models/`
2. **Create Services**: Add API services in `src/app/core/services/`
3. **Create Components**: Build UI in `src/app/features/`
4. **Update Routes**: Add routes to `src/app/app.routes.ts`
5. **Backend API**: Implement endpoints in `src/agent/dashboard-service.ts` and `src/agent/agent-api.ts`

### Testing

```bash
# Run Angular tests
cd dashboard
npm test

# E2E tests
npm run e2e
```

## API Endpoints

### Dashboard API

All dashboard endpoints are prefixed with `/api/v1/`:

#### Overview Statistics
```http
GET /api/v1/stats/overview
```

Response:
```json
{
  "filesDocumented": 42,
  "cacheHitRate": 0.85,
  "summariesCreated": 15,
  "pendingTodos": 8,
  "lastUpdate": "2025-12-02T12:00:00Z"
}
```

#### File Statuses
```http
GET /api/v1/files/status
```

Response:
```json
[
  {
    "path": "src/auth/login.ts",
    "status": "documented",
    "lastUpdated": "2025-12-02T10:30:00Z",
    "hasCache": true
  }
]
```

#### Activity Feed
```http
GET /api/v1/activity?days=7
```

Response:
```json
[
  {
    "type": "documentation",
    "message": "Updated documentation for auth-service.ts",
    "timestamp": "2025-12-02T11:30:00Z",
    "icon": "📝"
  }
]
```

#### LLM Configuration
```http
GET /api/v1/config/llm
```

Response:
```json
{
  "source": "env",
  "currentProvider": "openai",
  "providers": [
    {
      "name": "openai",
      "configured": true,
      "status": "connected",
      "model": "gpt-4-turbo-preview",
      "usage": {
        "requests": 145,
        "estimatedCost": 2.35,
        "cacheHitRate": 0.72
      }
    }
  ]
}
```

## Customization

### Styling
- Global styles: `dashboard/src/styles.scss`
- Component styles: Inline in component `.ts` files
- Theme colors: Update gradient in `app.scss`

### Environment Configuration
```typescript
// dashboard/src/environments/environment.ts
export const environment = {
  production: true,
  apiUrl: '/api/v1',
  wsUrl: 'ws://localhost:3000'
};
```

## Troubleshooting

### Dashboard Not Loading

**Symptoms**: 404 or blank page at `http://localhost:3000`

**Solutions**:
```bash
# Rebuild dashboard
npm run build:dashboard

# Check output exists
ls dashboard/dist/dashboard/browser

# Restart server
memowiki serve
```

### API Errors in Console

**Symptoms**: `Failed to load resource: 404` for `/api/v1/*`

**Solutions**:
```bash
# Ensure backend is built
npm run build

# Check server is running
curl http://localhost:3000/health

# Rebuild and restart
npm run build:all
memowiki serve
```

### Development Server CORS Issues

**Symptoms**: CORS errors during `ng serve`

**Solutions**:
- Ensure `proxy.conf.json` exists in dashboard directory
- Verify `angular.json` has `proxyConfig` set
- Restart `ng serve`

## Roadmap

### Phase 1 (Complete)
- ✅ Overview dashboard
- ✅ Documentation browser
- ✅ Summaries timeline
- ✅ Settings (LLM config display)
- ✅ Backend API integration

### Phase 2 (Planned)
- [ ] NgRx state management
- [ ] Charts and visualizations
- [ ] Mermaid diagram rendering
- [ ] Real-time updates via WebSocket
- [ ] Advanced filtering and sorting

### Phase 3 (Planned)
- [ ] Documentation editing
- [ ] LLM provider switching
- [ ] Custom dashboard layouts
- [ ] Export functionality
- [ ] Multi-user support

## See Also

- [Serve Command](./serve.md) - API server documentation
- [Configuration](./configuration.md) - LLM setup
- [Update Command](./update.md) - Documentation generation
