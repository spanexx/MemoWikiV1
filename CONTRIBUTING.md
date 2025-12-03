# Contributing to MemoWiki

Thank you for considering contributing to MemoWiki! This document provides guidelines for contributors.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- Git
- Optional: Docker (for ChromaDB)
- Optional: Python venv (for ChromaDB)

### Development Setup
1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd dashboard && npm install && cd ..
   ```
3. Copy `.env.example` to `.env` and configure your API keys
4. Start ChromaDB (for semantic search):
   ```bash
   # Option 1: Docker
   docker run -d --name chroma -p 8000:8000 chromadb/chroma:latest
   
   # Option 2: Python (see README for details)
   ```
5. Run development server:
   ```bash
   npm run dev:serve
   ```

## Project Structure
- `src/` - Core TypeScript library
  - `agent/` - Express API server and services
  - `builder/` - LLM providers and documentation generation
  - `scanner/` - Code parsing and file filtering
  - `search/` - Vector store and semantic search
  - `config/` - Configuration management
  - `wiki/` - Wiki file management
- `dashboard/` - Angular web dashboard
- `docs/` - Documentation

## Development Workflow

### Making Changes
1. Create a feature branch from `main`
2. Make your changes following existing code style
3. Add tests if applicable
4. Ensure all builds pass:
   ```bash
   npm run build:all
   ```
5. Test your changes locally

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions focused and small

### Testing
- Run unit tests: `npm test`
- Test CLI commands: `node dist/index.js --help`
- Test the dashboard: Visit `http://localhost:3000`
- Test semantic search with valid API keys

## Types of Contributions

### Bug Fixes
- Describe the bug in the issue
- Include steps to reproduce
- Add tests that prevent regression

### Features
- Open an issue to discuss large changes first
- Follow the existing patterns
- Update documentation as needed

### Documentation
- Improve README, inline comments, or JSDoc
- Fix typos or unclear explanations
- Add examples for new features

### Dashboard
- Angular components in `dashboard/src/app/`
- Follow Angular style guide
- Test UI changes in multiple browsers

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Ensure everything builds
6. Submit a pull request

### Pull Request Guidelines
- Use clear, descriptive titles
- Reference related issues
- Include screenshots for UI changes
- Keep PRs focused on one change

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# LLM Provider (choose one)
LLM_PROVIDER=openai|anthropic|gemini|openrouter|ollama|mock

# API Keys (set as needed)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
OPENROUTER_API_KEY=sk-or-v1-...

# ChromaDB (for semantic search)
CHROMA_URL=http://localhost:8000
ENABLE_SEMANTIC_SEARCH=true
```

## Common Development Tasks

### Adding a New LLM Provider
1. Implement `LLMProvider` interface in `src/builder/providers/`
2. Add configuration schema in `src/config/config.ts`
3. Register in `LLMService`
4. Update documentation

### Adding CLI Commands
1. Add command in `src/index.ts` using Commander.js
2. Implement logic in appropriate service
3. Update help text and examples

### Modifying the Dashboard
1. Angular CLI: `cd dashboard && ng generate component/module`
2. Update API endpoints in `src/agent/` if needed
3. Test with `npm run dev:serve`

## Release Process

Maintainers will handle releases:
1. Update version in `package.json`
2. Update CHANGELOG.md
3. Tag release: `git tag v1.x.x`
4. Publish to npm: `npm publish`
5. GitHub release with notes

## Getting Help

- Check existing issues and discussions
- Read the README and documentation
- Ask questions in GitHub Discussions
- Review code examples in the codebase

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thanks for contributing to MemoWiki! 🚀
