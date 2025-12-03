# Update Command

## Overview

The `update` command scans your codebase, generates documentation using LLM, and creates visual diagrams. It intelligently tracks changes using git and caches results to avoid redundant API calls.

## Usage

```bash
memowiki update [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--full` | Force full scan (ignore git diff) | `false` |
| `--verbose` | Show detailed output | `false` |

## How It Works

### 1. **File Discovery**
- Detects modified files from git status
- Or scans entire project with `--full`
- Filters by supported extensions (`.ts`, `.js`, `.tsx`, `.jsx`)
- Respects `.memowikiignore` file

### 2. **Smart Caching**
- Calculates content hash for each file
- Checks cache for existing documentation
- Only generates fresh docs for changed files
- Significantly reduces API calls

### 3. **Documentation Generation**
- Parses code structure (classes, functions, imports)
- Extracts git context (recent commits, authors)
- Generates markdown documentation via LLM
- Saves to `.codewiki/memory/`

### 4. **Diagram Creation**
- Creates class diagrams for each file
- Generates architecture diagram for entire project
- Saves to `.codewiki/diagrams/` and `.codewiki/flows/`

### 5. **Project Summary**
- Analyzes all files together
- Creates high-level project overview
- Saves to `.codewiki/summaries/project-overview.md`

## Examples

### Basic Update
```bash
memowiki update
```

Scans modified files and updates their documentation.

### Full Project Scan
```bash
memowiki update --full
```

Processes all files regardless of git status. Useful for:
- Initial documentation generation
- After major refactoring
- When cache is stale

### Verbose Output
```bash
memowiki update --verbose
```

Shows detailed progress:
```
🚀 Starting MemoWiki update...
   Processing src/auth/login.ts...
   ♻️  Using cached data
   Processing src/auth/register.ts...
   🤖 [openai:gpt-4-turbo-preview] Generating documentation...
   📊 Generating project summary...
   📐 Generating architecture diagram...
✨ Documentation updated successfully!
```

## Output Structure

```
.codewiki/
├── memory/
│   ├── login.md                # Individual file docs
│   ├── register.md
│   └── ...
├── diagrams/
│   ├── login.md                # Class diagrams
│   ├── register.md
│   └── ...
├── flows/
│   └── architecture.md         # System architecture
└── summaries/
    └── project-overview.md     # High-level summary
```

## Cache Management

Cache stored in `.codewiki/cache.json`:
- Content hash
- Timestamp
- LLM provider and model
- Generated documentation and diagrams

Cache invalidated when:
- File content changes
- LLM provider changes
- Model changes

## Performance Tips

1. **Use `--full` sparingly** - It processes all files
2. **Let git track changes** - Default mode is much faster
3. **Configure retry settings** - For flaky networks
4. **Use Ollama locally** - No API rate limits

## Filtering Files

Create `.memowikiignore` in project root:

```
# Ignore test files
**/*.test.ts
**/*.spec.ts

# Ignore build output
dist/**
build/**

# Ignore specific directories
legacy/**
temp/**
```

## Integration with Git

The update command respects your git workflow:
- **Modified files**: Automatically detected
- **Staged files**: Included in scan
- **Untracked files**: Excluded by default
- **Ignored files**: Always excluded

## Continuous Documentation

Recommended workflow:
1. Make code changes
2. Commit to git
3. Run `memowiki update`
4. Review generated docs
5. Commit documentation

Or use a git hook:
```bash
# .git/hooks/post-commit
#!/bin/bash
memowiki update --verbose
```

## Error Handling

**File not supported:**
```
⚠️  Skipping unsupported file: config.json
```

**Parse error:**
```
⚠️  Failed to parse src/broken.ts: Unexpected token
```

**LLM error:**
```
⚠️  Failed to generate documentation (retrying...)
```

The command continues processing other files even if some fail.

## See Also

- [Configuration Guide](./configuration.md) - LLM provider setup
- [Record Command](./record.md) - Agent implementation summaries
