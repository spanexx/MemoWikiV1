# Serve Command

## Overview

The `serve` command starts an HTTP API server that exposes MemoWiki functionality for external integrations. This enables IDEs, CI/CD pipelines, and other tools to access documentation programmatically.

## Usage

```bash
memowiki serve [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <number>` | Port to run server on | `3000` |

## How It Works

Starts an Express server with:
- **REST API endpoints**: Documentation, search, summaries, health monitoring
- **Dashboard API**: Overview stats, file statuses, activity feed, LLM config
- **Static File Serving**: Serves the Angular dashboard web interface
- **SPA Routing**: Handles client-side routing for the dashboard

## Examples

### Default Port
```bash
memowiki serve
```

Output:
```
🚀 MemoWiki Agent API running on http://localhost:3000
   Health check: http://localhost:3000/health
   Dashboard: http://localhost:3000
```

Access the web dashboard at `http://localhost:3000` or use the API at `/api/v1/*`.

### Custom Port
```bash
memowiki serve --port 8080
```

Starts server on port 8080.

### Background Process
```bash
# Using nohup
nohup memowiki serve > server.log 2>&1 &

# Using pm2
pm2 start "memowiki serve" --name memowiki-api
```

## API Endpoints

### Generate Documentation
```http
POST /api/v1/documentation
Content-Type: application/json

{
  "file": "src/auth/login.ts",
  "force": false
}
```

Response:
```json
{
  "file": "src/auth/login.ts",
  "documentation": "# Login Module\n\n...",
  "diagram": "```mermaid\nclassDiagram\n..."
}
```

### Search Codebase
```http
GET /api/v1/search?query=authentication&limit=10
```

Response:
```json
{
  "results": [
    {
      "id": "src/auth/login.ts:authenticateUser",
      "similarity": 0.952,
      "content": "Authenticates user credentials...",
      "metadata": {
        "type": "function",
        "file": "src/auth/login.ts"
      }
    }
  ]
}
```

### Create Summary
```http
POST /api/v1/summaries
Content-Type: application/json

{
  "files": ["src/auth/login.ts"],
  "type": "feature",
  "output": "auth-implementation"
}
```

Response:
```json
{
  "id": "auth-implementation",
  "path": ".codewiki/summaries/auth-implementation.md",
  "timestamp": 1733140000
}
```

### Get Recent Summaries
```http
GET /api/v1/summaries?limit=5
```

Response:
```json
{
  "summaries": [
    {
      "id": "auth-implementation",
      "timestamp": 1733140000,
      "type": "feature",
      "files": ["src/auth/login.ts"]
    }
  ]
}
```

### Health Check
```http
GET /api/v1/health
```

Response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 3600
}
```

## Client Examples

### JavaScript/TypeScript
```typescript
// Generate documentation
const response = await fetch('http://localhost:3000/api/v1/documentation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file: 'src/auth/login.ts'
  })
});

const { documentation } = await response.json();
console.log(documentation);

// Search
const searchResponse = await fetch(
  'http://localhost:3000/api/v1/search?query=authentication&limit=5'
);
const { results } = await searchResponse.json();
```

### Python
```python
import requests

# Generate documentation
response = requests.post(
    'http://localhost:3000/api/v1/documentation',
    json={'file': 'src/auth/login.ts'}
)
doc = response.json()['documentation']

# Search
search_response = requests.get(
    'http://localhost:3000/api/v1/search',
    params={'query': 'authentication', 'limit': 5}
)
results = search_response.json()['results']
```

### cURL
```bash
# Generate documentation
curl -X POST http://localhost:3000/api/v1/documentation \
  -H "Content-Type: application/json" \
  -d '{"file":"src/auth/login.ts"}'

# Search
curl "http://localhost:3000/api/v1/search?query=authentication&limit=5"

# Health check
curl http://localhost:3000/api/v1/health
```

## IDE Integration

### VS Code Extension
```typescript
// extension.ts
import * as vscode from 'vscode';

async function generateDocs(file: string) {
  const response = await fetch('http://localhost:3000/api/v1/documentation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file })
  });
  
  const { documentation } = await response.json();
  
  // Show in editor
  const doc = await vscode.workspace.openTextDocument({
    content: documentation,
    language: 'markdown'
  });
  
  await vscode.window.showTextDocument(doc);
}
```

### JetBrains Plugin
```kotlin
// MemoWikiAction.kt
class GenerateDocsAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val file = e.getData(CommonDataKeys.VIRTUAL_FILE)
        val client = HttpClient()
        
        val response = client.post("http://localhost:3000/api/v1/documentation") {
            contentType(ContentType.Application.Json)
            setBody(mapOf("file" to file.path))
        }
        
        // Display documentation
    }
}
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Start MemoWiki API
  run: |
    memowiki serve --port 3000 &
    sleep 2

- name: Generate docs for changed files
  run: |
    for file in $(git diff --name-only HEAD~1); do
      curl -X POST http://localhost:3000/api/v1/documentation \
        -H "Content-Type: application/json" \
        -d "{\"file\":\"$file\"}"
    done
```

### GitLab CI
```yaml
documentation:
  script:
    - memowiki serve --port 3000 &
    - sleep 2
    - |
      for file in $(git diff --name-only HEAD~1); do
        curl -X POST http://localhost:3000/api/v1/documentation \
          -H "Content-Type: application/json" \
          -d "{\"file\":\"$file\"}"
      done
```

## Security Considerations

### Local Development Only
The API server is designed for local development:
- No authentication by default
- Binds to localhost only
- Not intended for production deployment

### Production Deployment
If deploying to production, add:
```typescript
// Add authentication middleware
app.use('/api', authenticateRequest);

// Add rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Add CORS
app.use(cors({
  origin: 'https://your-domain.com'
}));
```

## Monitoring

### Server Logs
```bash
# View logs
tail -f server.log

# With timestamp
memowiki serve | ts '[%Y-%m-%d %H:%M:%S]'
```

### Health Monitoring
```bash
# Check if server is running
curl http://localhost:3000/api/v1/health

# Automated monitoring
watch -n 10 'curl -s http://localhost:3000/api/v1/health | jq'
```

## Troubleshooting

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Use different port
memowiki serve --port 8080

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Connection Refused
```
curl: (7) Failed to connect to localhost port 3000
```

**Solution:**
```bash
# Ensure server is running
memowiki serve

# Check firewall settings
sudo ufw allow 3000
```

## See Also

- [Configuration Guide](./configuration.md) - API server configuration
- [Update Command](./update.md) - Documentation generation
- [Search Command](./search.md) - Semantic search API
