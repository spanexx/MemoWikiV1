# MemoWiki

**A persistent memory layer for your codebase** - Automated documentation generation with LLM-powered insights, semantic search, and agent-driven summaries.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Overview

MemoWiki transforms your code into searchable, up-to-date documentation automatically. It leverages Large Language Models (LLMs) to generate comprehensive docs, diagrams, and summaries while intelligently caching results to minimize API usage.

### Key Features

- ✅ **Automated Documentation** - Generate docs from code with LLM analysis
- ✅ **Visual Diagrams** - Mermaid class and architecture diagrams
- ✅ **Semantic Search** - Natural language code search with vector embeddings
- ✅ **Agent Summaries** - Track AI agent implementation progress
- ✅ **Smart Caching** - Avoid redundant API calls
- ✅ **Git Integration** - Auto-detect changes and track history
- ✅ **Multi-LLM Support** - OpenAI, Anthropic, Gemini, OpenRouter, Ollama
- ✅ **REST API** - Expose functionality for IDE/CI integrations
- ✅ **Web Dashboard** - Visual interface for monitoring and management

## Quick Start

### Installation

```bash
npm install -g memowiki
```

### Configuration

Create a `.env` file:

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

See [Configuration Guide](./docs/configuration.md) for all providers.

### Basic Usage

```bash
# Generate documentation for your codebase
memowiki update

# Record an agent implementation summary
memowiki record --type feature --output my-feature

# Query summaries
memowiki summaries --recent 5

# Search code semantically
memowiki search "authentication logic"

# Analyze repository
memowiki analyze

# Start API server (with integrated dashboard)
memowiki serve

# Build dashboard and backend
npm run build:all
```

## Web Dashboard

MemoWiki now includes a web dashboard for visualizing and managing your codebase documentation.

### Features
- **Overview** - Stats cards showing documented files, cache hit rate, and pending TODOs
- **Documentation Browser** - Browse and filter documentation status by file
- **Summaries Timeline** - View agent implementation summaries with filtering
- **Settings** - Manage LLM provider configuration
- **Activity Feed** - Track recent documentation updates

### Quick Start

```bash
# Build both backend and dashboard
npm run build:all

# Start the server (serves both API and dashboard)
memowiki serve

# Access dashboard at http://localhost:3000
```

### Development Mode

```bash
# Terminal 1: Start backend API
memowiki serve

# Terminal 2: Start dashboard with hot-reload
cd dashboard
ng serve
# Access at http://localhost:4200
```

### Build Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build backend only |
| `npm run build:dashboard` | Build dashboard only |
| `npm run build:all` | Build both backend and dashboard |

## Commands

### Core Commands

| Command | Description | Documentation |
|---------|-------------|---------------|
| `update` | Generate documentation for codebase | [Guide](./docs/update.md) |
| `record` | Create agent implementation summaries | [Guide](./docs/record.md) |
| `summaries` | Query agent summaries | [Guide](./docs/summaries.md) |
| `search` | Semantic code search | [Guide](./docs/search.md) |
| `analyze` | Git repository insights | [Guide](./docs/analyze.md) |
| `serve` | Start REST API server + dashboard | [Guide](./docs/serve.md) |
| `intent` | Analyze code change intent | [Guide](./docs/intent.md) |

### Command Details

#### Update - Generate Documentation
```bash
memowiki update [--full] [--verbose]
```

- Auto-detects changed files from git
- Generates markdown documentation
- Creates class and architecture diagrams
- Intelligently caches results

📖 [Full Documentation](./docs/update.md)

#### Record - Agent Summaries
```bash
memowiki record [-f files...] [-o name] [-t type] [--append]
```

- Track AI agent implementation progress
- Identify TODOs, stubs, and completed work
- Create structured summaries with LLM analysis
- Support incremental documentation

📖 [Full Documentation](./docs/record.md)

#### Summaries - Query Agent Work
```bash
memowiki summaries [-f file] [-t type] [-r recent]
```

- Efficient index-based filtering
- Query by file, type, or recency
- No need to parse all summary files

📖 [Full Documentation](./docs/summaries.md)

#### Search - Semantic Code Search
```bash
memowiki search <query> [-n limit]
```

- Natural language queries
- Vector embedding similarity search
- Returns ranked results with snippets

📖 [Full Documentation](./docs/search.md)

#### Analyze - Repository Insights
```bash
memowiki analyze
```

- View git repository status
- See recent commits and branch info
- Detect merge conflicts

📖 [Full Documentation](./docs/analyze.md)

#### Serve - API Server
```bash
memowiki serve [-p port]
```

- REST API for external integrations
- IDE plugins and CI/CD pipelines
- Programmatic access to all features

📖 [Full Documentation](./docs/serve.md)

#### Intent - Change Classification
```bash
memowiki intent
```

- Analyze code change intent
- Classify as bug fix, feature, refactor, etc.
- Provide actionable suggestions

📖 [Full Documentation](./docs/intent.md)

## Documentation

### Guides
- [Configuration](./docs/configuration.md) - LLM provider setup
- [Dashboard](./docs/dashboard.md) - Web interface guide
- [Update Command](./docs/update.md) - Documentation generation
- [Record Command](./docs/record.md) - Agent summaries
- [Summaries Command](./docs/summaries.md) - Query summaries
- [Search Command](./docs/search.md) - Semantic search
- [Analyze Command](./docs/analyze.md) - Repository analysis
- [Serve Command](./docs/serve.md) - API server
- [Intent Command](./docs/intent.md) - Intent classification

## Supported LLM Providers

| Provider | Setup | Best For |
|----------|-------|----------|
| **OpenAI** | Requires API key | Production quality |
| **Anthropic** | Requires API key | Long context |
| **Gemini** | Requires API key | Cost-effective |
| **OpenRouter** | Requires API key | Model flexibility |
| **Ollama** | Local install | Privacy, no limits |
| **Mock** | No setup | Testing |

See [Configuration Guide](./docs/configuration.md) for detailed setup.

## Output Structure

```
.codewiki/
├── memory/           # Individual file documentation
├── diagrams/         # Class diagrams
├── flows/            # Architecture diagrams
├── summaries/        # Project and agent summaries
│   ├── index.json   # Summary metadata index
│   └── *.md         # Summary files
└── cache.json        # Documentation cache
```

## Use Cases

### For Developers
- **Onboarding** - New team members understand codebase quickly
- **Documentation** - Automated, always up-to-date
- **Code Review** - Context for pull requests
- **Architecture** - Visual system diagrams

### For AI Agents
- **Memory** - Persistent knowledge of codebase
- **Context** - Understand system architecture
- **Progress Tracking** - Document implementation work
- **TODO Management** - Track incomplete work

### For Teams
- **Knowledge Sharing** - Centralized code knowledge
- **Change Tracking** - Git-integrated documentation
- **Search** - Find code by natural language
- **API Access** - Integrate with existing tools

## Programmatic Usage

```typescript
import {
  LLMService,
  WikiManager,
  SummaryGenerator,
  SearchService,
  GitService
} from 'memowiki';

// Generate documentation
const llmService = new LLMService(config);
const doc = await llmService.generateDocumentation(codeStructure, gitState);

// Create agent summary
const generator = new SummaryGenerator(llmService, config);
const summary = await generator.generateImplementationSummary(
  ['src/auth/login.ts'],
  'feature'
);

// Search codebase
const searchService = new SearchService();
await searchService.initialize();
const results = await searchService.search('authentication', 10);

// Analyze git
const gitService = new GitService();
const gitState = await gitService.getGitState();
```

## Integration Examples

### VS Code Extension
```typescript
// Generate docs on save
vscode.workspace.onDidSaveTextDocument(async (document) => {
  const response = await fetch('http://localhost:3000/api/v1/documentation', {
    method: 'POST',
    body: JSON.stringify({ file: document.fileName })
  });
});
```

### GitHub Actions
```yaml
- name: Generate Documentation
  run: |
    memowiki update
    git add .codewiki
    git commit -m "docs: update documentation"
    git push
```

### Git Hook
```bash
#!/bin/bash
# .git/hooks/post-commit
memowiki update
memowiki record --type feature
```

## Performance

- **Caching** - Avoids redundant API calls (10-100x faster on unchanged files)
- **Incremental Updates** - Only processes changed files
- **Parallel Processing** - Concurrent LLM requests
- **Smart Filtering** - Respects `.gitignore` and `.memowikiignore`

## Requirements

- Node.js 16+ 
- Git repository (optional but recommended)
- LLM provider API key (or Ollama for local)
- ChromaDB (optional, for semantic search)

## Troubleshooting

```bash
# Clear cache
rm -rf .codewiki/cache.json

# Regenerate all docs
memowiki update --full

# Enable verbose logging
memowiki update --verbose

# Test configuration
memowiki analyze
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Issues](https://github.com/yourusername/memowiki/issues)
- 💬 [Discussions](https://github.com/yourusername/memowiki/discussions)
- 📧 [Email](mailto:support@memowiki.dev)

---

**Built with ❤️ for developers and AI agents**
