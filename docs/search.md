# Search Command

## Overview

The `search` command provides semantic search across your codebase wiki using natural language queries. It leverages vector embeddings and similarity matching to find relevant code.

## Usage

```bash
memowiki search <query> [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-n, --limit <number>` | Number of results to return | `10` |

## Requirements

### ChromaDB Instance
```bash
# Using Docker
docker run -p 8000:8000 chromadb/chroma

# Or install locally
pip install chromadb
chroma run --host localhost --port 8000
```

### Enable in Configuration
```bash
ENABLE_SEMANTIC_SEARCH=true
CHROMA_URL=http://localhost:8000
```

## How It Works

### 1. **Embedding Generation**
- Code documentation converted to vector embeddings
- Uses sentence transformers or OpenAI embeddings
- Stored in ChromaDB vector database

### 2. **Similarity Search**
- Query converted to embedding
- Cosine similarity with stored vectors
- Returns top N most similar documents

### 3. **Results Ranking**
- Ranked by similarity score (0-100%)
- Includes code metadata (type, file, name)
- Shows snippet of matched content

## Examples

### Basic Search
```bash
memowiki search "authentication with JWT"
```

Output:
```
🔍 Searching for: "authentication with JWT"

📊 Found 3 results:

1. [95.2%] src/auth/login.ts
   Function: authenticateUser
   Authenticates user credentials and generates JWT token for session management...

2. [87.3%] src/auth/middleware.ts
   Function: verifyToken
   Validates JWT tokens from Authorization header and extracts user claims...

3. [72.1%] src/types/auth.ts
   Interface: JWTPayload
   Defines structure of JWT token payload including user ID and expiration...
```

### Limited Results
```bash
memowiki search "database connection" --limit 5
```

Returns top 5 matches only.

### Complex Queries

**Natural language:**
```bash
memowiki search "how do we handle errors in API requests"
```

**Technical terms:**
```bash
memowiki search "React hooks for state management"
```

**Code patterns:**
```bash
memowiki search "async functions that return promises"
```

## Indexed Content

The search indexes:
- **Function documentation** - Purpose, parameters, returns
- **Class documentation** - Overview, methods, properties
- **File summaries** - High-level purpose and exports
- **Architecture notes** - System design and patterns

## Performance

**Query speed:**
- Simple query: ~50-100ms
- Complex query: ~100-200ms
- Large codebase (1000+ files): ~200-500ms

**Index size:**
- ~10KB per file
- 100 files: ~1MB
- 1000 files: ~10MB

## Search Tips

### Use Natural Language
❌ **Bad:** `jwt auth token`
✅ **Good:** `how do we authenticate users with JWT tokens`

### Be Specific
❌ **Bad:** `database`
✅ **Good:** `database connection pooling configuration`

### Include Context
❌ **Bad:** `error handling`
✅ **Good:** `error handling in GraphQL resolvers`

## Integration

### Programmatic Access
```typescript
import { SearchService } from 'memowiki';

const searchService = new SearchService();
await searchService.initialize();

const results = await searchService.search('authentication', 10);

results.forEach(result => {
  console.log(`${result.similarity}% - ${result.id}`);
  console.log(result.content);
});
```

### Custom Filters
```typescript
// Search within specific module
const authResults = results.filter(r => 
  r.metadata.file.startsWith('src/auth')
);

// Filter by code element type
const functions = results.filter(r => 
  r.metadata.type === 'function'
);
```

## Indexing

### Initial Indexing
```bash
# Run update to generate docs
memowiki update --full

# Docs are automatically indexed if ChromaDB is enabled
```

### Re-indexing
```bash
# Delete ChromaDB data
rm -rf .chromadb/

# Re-run update
memowiki update --full
```

### Selective Indexing
```typescript
// Index specific files
const searchService = new SearchService();
await searchService.indexFiles(['src/auth/*.ts']);
```

## Troubleshooting

### ChromaDB Not Running
```
❌ Semantic search is disabled. Enable it in .env with ENABLE_SEMANTIC_SEARCH=true
```

**Solution:**
```bash
# Start ChromaDB
docker run -p 8000:8000 chromadb/chroma

# Or
chroma run --host localhost --port 8000
```

### Connection Error
```
❌ Failed to connect to ChromaDB at http://localhost:8000
```

**Solution:**
```bash
# Check ChromaDB is running
curl http://localhost:8000/api/v1/heartbeat

# Update CHROMA_URL in .env if different
CHROMA_URL=http://your-host:8000
```

### No Results
```
No results found.
```

**Possible causes:**
1. Wiki not generated yet - run `memowiki update`
2. Query too specific - try broader terms
3. Content not indexed - check ChromaDB has data

## Advanced Features

### Filtering Results
```typescript
// By similarity threshold
const highQuality = results.filter(r => r.similarity > 0.8);

// By file pattern
const authResults = results.filter(r => 
  r.id.includes('auth')
);
```

### Batch Queries
```typescript
const queries = [
  'authentication',
  'database connection',
  'error handling'
];

const allResults = await Promise.all(
  queries.map(q => searchService.search(q, 5))
);
```

## See Also

- [Update Command](./update.md) - Generate searchable docs
- [Configuration Guide](./configuration.md) - Enable semantic search
