# Configuration Guide

## Overview

MemoWiki supports multiple LLM providers for generating documentation. Configure your preferred provider using environment variables.

## Supported Providers

### OpenAI
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview  # Default
```

**Supported Models:**
- `gpt-4-turbo-preview`
- `gpt-4`
- `gpt-3.5-turbo`

### Anthropic (Claude)
```bash
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-api-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022  # Default
```

**Supported Models:**
- `claude-3-5-sonnet-20241022`
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`

### Google Gemini
```bash
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-1.5-pro  # Default
```

**Supported Models:**
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `gemini-pro`

### OpenRouter
```bash
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your-api-key-here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet  # Default
```

**Supported Models:**
- Any model available on OpenRouter
- See https://openrouter.ai/models for full list

### Ollama (Local)
```bash
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434  # Default
OLLAMA_MODEL=llama2  # Default
```

**Requirements:**
- Ollama running locally or remotely
- Model pulled: `ollama pull llama2`

### Mock (Testing)
```bash
LLM_PROVIDER=mock
```

Returns placeholder content for testing without API calls.

## Additional Settings

### Semantic Search (Optional)
```bash
ENABLE_SEMANTIC_SEARCH=true
CHROMA_URL=http://localhost:8000  # Default
```

**Requirements:**
- ChromaDB instance running
- Used for `memowiki search` command

### Retry Configuration
```bash
MAX_RETRIES=3  # Default
RETRY_DELAY=1000  # Default (milliseconds)
```

## Environment File

Create a `.env` file in your project root:

```bash
# .env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

ENABLE_SEMANTIC_SEARCH=false
MAX_RETRIES=3
RETRY_DELAY=1000
```

## Programmatic Configuration

```typescript
import { ConfigManager } from 'memowiki';

const configManager = new ConfigManager({
  provider: 'openai',
  openaiApiKey: 'sk-...',
  openaiModel: 'gpt-4-turbo-preview',
  maxRetries: 3,
  retryDelay: 1000
});

const config = configManager.getConfig();
```

## Validation

MemoWiki validates configuration on startup:
- ✅ API keys required for cloud providers
- ✅ Model names validated
- ✅ Connection tested (optional)

## Best Practices

1. **Use environment variables** for API keys (never commit to git)
2. **Start with mock provider** for testing
3. **Use Ollama** for local development
4. **Use cloud providers** for production quality
5. **Configure retry settings** based on provider reliability
