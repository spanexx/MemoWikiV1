# MemoWiki Development Roadmap

## Phase 1: Core Functionality Implementation ✅

### 1.1 LLM Service Implementation
- [x] Implement actual LLM calls for OpenAI provider (`src/builder/providers/openai.ts`)
- [x] Implement actual LLM calls for Anthropic provider (`src/builder/providers/anthropic.ts`)
- [x] Add Gemini provider implementation (`src/builder/providers/gemini.ts`)
- [x] Add OpenRouter provider implementation (`src/builder/providers/openrouter.ts`)
- [x] Add Ollama provider implementation (`src/builder/providers/ollama.ts`)
- [x] Remove stubbed error throws for unimplemented providers
- [x] Implement proper error handling for LLM API calls (retry logic with backoff)

### 1.2 Configuration Management
- [x] Get API key from config/env instead of hardcoded value (`src/config/config.ts`)
- [x] Add proper configuration file support (.env with Zod validation)
- [x] Support for different LLM providers through configuration

## Phase 2: Enhanced Features ✅

### 2.1 Intelligent File Scanning
- [x] Improve file scanning logic to be smarter about what files to scan (FileFilter with default exclusions)
- [x] Implement selective scanning based on git changes (--full flag to override)
- [x] Add support for ignoring certain files/directories (.memowikiignore support)

### 2.2 Wiki Enhancement
- [x] Enhance wiki structure with additional sections (flows directory added)
- [x] Improve markdown generation for better documentation (enhanced prompts with architecture & patterns)
- [x] Add support for different diagram types beyond Mermaid (sequence diagrams and flowcharts)


## Phase 3: Advanced Capabilities

### 3.1 Semantic Search Integration
- [x] Integrate vector database (ChromaDB) for semantic search
- [x] Store embeddings of functions, components, and services
- [x] Implement semantic search capabilities (`memowiki search` command)

### 3.2 Enhanced Git Integration
- [x] Improved Git observer tracking (`memowiki analyze` command)
- [x] Add support for branch analysis (current/upstream/ahead-behind)
- [x] Implement conflict detection and resolution suggestions

## Phase 4: Agent Integration ✅

### 4.1 AI Agent Context
- [x] Develop mechanism for agents to access wiki memory (ContextService & Agent API)
- [x] Implement long-term context preservation for AI agents (Session storage ready)
- [x] Add intent recognition based on code changes (`memowiki intent` command)

### Phase 5: Library/Module Export

### 5.1 Package Refactoring
- [x] Refactoring index.ts to export core classes
- [x] Making the configuration system instance-based rather than global
- [x] Adding proper TypeScript declarations for exported modules

## Phase 6: Performance & Logging

### 6.1 Performance Improvements
- [x] Optimize file parsing for large codebases
- [x] Implement caching mechanisms
- [x] Add incremental updates to avoid full rescans
- [x] Add explicit LLM usage logging

