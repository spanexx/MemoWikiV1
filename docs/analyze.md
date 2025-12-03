# Analyze Command

## Overview

The `analyze` command provides insights into your git repository, showing recent activity, file changes, branch status, and potential merge conflicts.

## Usage

```bash
memowiki analyze
```

## No Options
This command has no options. It always displays complete repository status.

## Output Sections

### 1. Repository Status
```
=== Repository Status ===
Modified files: 5
Created files: 2
Deleted files: 1
```

Shows current working directory changes.

### 2. Recent Commit
```
=== Recent Commit ===
Message: feat: add authentication
Author: John Doe
Date: 2025-12-02T10:30:00Z
```

Most recent commit information.

### 3. Branch Information
```
=== Branch Information ===
Current Branch: feature/auth
Upstream: origin/feature/auth
Ahead: 2 / Behind: 0
```

Branch tracking and sync status.

### 4. Merge Conflicts (if any)
```
⚠️  Merge Conflicts Detected:
  - src/auth/login.ts
  - src/auth/middleware.ts
```

Files with merge conflicts.

## Examples

### Basic Analysis
```bash
memowiki analyze
```

Full output:
```
📊 Analyzing git repository...

=== Repository Status ===
Modified files: 3
Created files: 1
Deleted files: 0

=== Recent Commit ===
Message: feat: implement login flow
Author: Alice Developer
Date: 2025-12-02T09:15:30Z

=== Branch Information ===
Current Branch: main
Upstream: origin/main
Ahead: 0 / Behind: 0

✨ Analysis complete!
```

## Use Cases

### Pre-Commit Check
```bash
# Check status before committing
memowiki analyze

# Shows what will be documented
memowiki update
```

### Code Review Prep
```bash
# See what changed
memowiki analyze

# Generate docs for review
memowiki update
memowiki record --type feature
```

### Merge Conflict Detection
```bash
# Check for conflicts
memowiki analyze

# Shows files needing resolution
```

### Branch Sync Status
```bash
# Check if branch is up to date
memowiki analyze

# Shows ahead/behind count
```

## Integration

### Programmatic Access
```typescript
import { GitService } from 'memowiki';

const gitService = new GitService();

// Check if git repo
const isRepo = await gitService.isRepo();

// Get full status
const gitState = await gitService.getGitState();

console.log('Modified:', gitState.status.modified);
console.log('Branch:', gitState.branch.current);
console.log('Conflicts:', gitState.conflicts);
```

### Git State Object
```typescript
interface GitState {
  status: {
    modified: string[];
    created: string[];
    deleted: string[];
    renamed: string[];
  };
  branch: {
    current: string;
    upstream?: string;
    ahead: number;
    behind: number;
  };
  recentCommit?: {
    hash: string;
    message: string;
    author_name: string;
    author_email: string;
    date: string;
  };
  conflicts: string[];
}
```

## CI/CD Integration

### Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Analyzing repository..."
memowiki analyze

if [ $? -ne 0 ]; then
  echo "Git analysis failed"
  exit 1
fi
```

### CI Pipeline
```yaml
# .github/workflows/docs.yml
- name: Analyze repository
  run: memowiki analyze

- name: Generate docs for changes
  run: memowiki update
```

## Troubleshooting

### Not a Git Repository
```
❌ Not a git repository.
```

**Solution:**
```bash
git init
```

### No Upstream Branch
```
Current Branch: feature/new
Upstream: (none)
Ahead: 0 / Behind: 0
```

**Solution:**
```bash
git push -u origin feature/new
```

### Outdated Branch
```
Ahead: 0 / Behind: 5
```

**Solution:**
```bash
git pull origin main
```

## Related Commands

The analyze command complements:

**Update** - Uses git status to detect modified files
```bash
memowiki analyze  # See what changed
memowiki update   # Generate docs for changes
```

**Record** - Uses git to auto-detect files for summary
```bash
memowiki analyze              # Check current changes
memowiki record --type feature  # Auto-detects files
```

## Performance

- Fast execution (~10-50ms)
- No API calls required
- Reads git metadata locally
- Minimal resource usage

## See Also

- [Update Command](./update.md) - Uses git status
- [Record Command](./record.md) - Auto-detects files from git
