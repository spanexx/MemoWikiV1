# MemoWiki Development Roadmap

## Phase 1: Core Functionality Implementation

### 1.1 LLM Service Implementation
- [ ] Implement actual LLM calls for OpenAI provider (`src/builder/llm-service.ts:52`)
- [ ] Implement actual LLM calls for Anthropic provider (`src/builder/llm-service.ts:65`)
- [ ] Remove stubbed error throws for unimplemented providers
- [ ] Implement proper error handling for LLM API calls

### 1.2 Configuration Management
- [ ] Get API key from config/env instead of hardcoded value (`src/index.ts:30`)
- [ ] Add proper configuration file support
- [ ] Support for different LLM providers through configuration

## Phase 2: Enhanced Features

### 2.1 Intelligent File Scanning
- [ ] Improve file scanning logic to be smarter about what files to scan
- [ ] Implement selective scanning based on git changes
- [ ] Add support for ignoring certain files/directories

### 2.2 Wiki Enhancement
- [ ] Enhance wiki structure with additional sections (flows, summaries)
- [ ] Improve markdown generation for better documentation
- [ ] Add support for different diagram types beyond Mermaid

## Phase 3: Advanced Capabilities

### 3.1 Semantic Search Integration
- [ ] Integrate vector database (Chroma/Qdrant) for semantic search
- [ ] Store embeddings of functions, components, and services
- [ ] Implement semantic search capabilities

### 3.2 Enhanced Git Integration
- [ ] Improve Git observer to track more detailed change information
- [ ] Add support for branch analysis
- [ ] Implement conflict detection and resolution suggestions

## Phase 4: Agent Integration

### 4.1 AI Agent Context
- [ ] Develop mechanism for agents to access wiki memory
- [ ] Implement long-term context preservation for AI agents
- [ ] Add intent recognition based on code changes

## Future Considerations

### Performance Improvements
- [ ] Optimize file parsing for large codebases
- [ ] Implement caching mechanisms
- [ ] Add incremental updates to avoid full rescans

### Additional Providers
- [ ] Implement Gemini provider integration
- [ ] Add support for other LLM providers
- [ ] Create abstraction layer for easy provider switching