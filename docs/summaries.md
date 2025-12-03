# Summaries Command

## Overview

The `summaries` command queries agent implementation summaries created by the [`record` command](./record.md). It provides efficient filtering without parsing all summary files.

## Usage

```bash
memowiki summaries [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-f, --file <file>` | Filter by file path | - |
| `-t, --type <type>` | Filter by type (feature\|bugfix\|refactor) | - |
| `-r, --recent <number>` | Get recent summaries | `10` |

## How It Works

### Index-Based Retrieval
- Reads metadata from `.codewiki/summaries/index.json`
- No need to parse all summary markdown files
- Fast filtering on metadata only
- Lazy loading of actual content

### Index Structure
```json
{
  "entries": [
    {
      "id": "auth-implementation",
      "timestamp": 1733140000,
      "type": "feature",
      "files": ["src/auth/login.ts", "src/auth/register.ts"],
      "summaryPath": "summaries/auth-implementation.md"
    }
  ]
}
```

## Examples

### Recent Summaries
```bash
memowiki summaries --recent 5
```

Output:
```
Found 5 summaries:

auth-implementation (2025-12-02)
Type: feature
Files: 2 files
Path: summaries/auth-implementation.md
---

fix-login-bug (2025-12-01)
Type: bugfix
Files: 1 files
Path: summaries/fix-login-bug.md
---
```

### Filter by File
```bash
memowiki summaries --file src/auth/login.ts
```

Shows all summaries that modified `src/auth/login.ts`.

### Filter by Type
```bash
memowiki summaries --type feature
```

Shows only feature implementation summaries.

### Combining with Other Commands

**View specific summary:**
```bash
# Find summaries
memowiki summaries --recent 3

# Read specific summary
cat .codewiki/summaries/auth-implementation.md
```

**Filter and grep:**
```bash
# Find summaries touching auth
memowiki summaries --file src/auth | grep -i "oauth"
```

## Output Format

Each entry shows:
- **Summary ID** - Unique identifier
- **Date** - When summary was created
- **Type** - feature, bugfix, or refactor
- **File Count** - Number of files included
- **Path** - Relative path to summary file

## Use Cases

### Finding Related Work
```bash
# What was done in auth?
memowiki summaries --file src/auth

# What features were added recently?
memowiki summaries --type feature --recent 10
```

### Reviewing History
```bash
# What was done today?
memowiki summaries --recent 20 | grep $(date +%Y-%m-%d)

# What bugs were fixed?
memowiki summaries --type bugfix
```

### Agent Context
```bash
# What's the latest work on this file?
memowiki summaries --file src/services/payment.ts --recent 1
```

## Performance

**Fast queries** - Index-based filtering:
- 100 summaries: ~10ms
- 1,000 summaries: ~50ms
- 10,000 summaries: ~200ms

**Lazy loading** - Content only loaded when needed:
- Listing summaries: reads index only
- Viewing summary: reads specific file

## Integration

### Programmatic Access
```typescript
import { SummaryRetriever } from 'memowiki';

const retriever = new SummaryRetriever('.codewiki');

// Get recent
const recent = await retriever.getRecent(5);

// Get by file
const byFile = await retriever.getByFile('src/auth/login.ts');

// Get by type
const features = await retriever.getByType('feature');
```

### Custom Queries
```typescript
// Complex filtering
const summaries = await retriever.getByFile('src/auth');
const bugfixes = summaries.filter(s => s.type === 'bugfix');
const recent = bugfixes.slice(0, 5);
```

## Maintenance

### Rebuilding Index
If index gets corrupted:
```bash
# Delete index
rm .codewiki/summaries/index.json

# Re-record will recreate it
memowiki record --files src/**/*.ts
```

### Cleaning Old Summaries
```bash
# Find old summaries
memowiki summaries --recent 100

# Manual cleanup
rm .codewiki/summaries/old-summary.md

# Update index (re-record will fix it)
```

## See Also

- [Record Command](./record.md) - Create summaries
- [Update Command](./update.md) - Generate documentation
