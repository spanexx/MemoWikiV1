# Record Command

## Overview

The `record` command enables AI agents to save incremental implementation summaries. It tracks what was implemented, what was stubbed, and what remains as TODOs, creating a continuous documentation trail.

## Usage

```bash
memowiki record [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-f, --files <files...>` | Files to include in summary | Auto-detect from git |
| `-o, --output <name>` | Summary filename | `implementation-YYYY-MM-DD` |
| `-t, --type <type>` | Summary type: feature\|bugfix\|refactor | `feature` |
| `--append` | Append to existing summary | `false` |

## How It Works

### 1. **File Detection**
- Auto-detects modified/created files from git
- Or accepts explicit file list via `--files`

### 2. **Code Analysis**
Analyzes code for:
- **TODOs**: Comments containing TODO, FIXME, XXX
- **Stubs**: Empty functions, placeholder returns, unimplemented methods
- **Completed**: Fully functional code

### 3. **LLM Summary Generation**
Creates structured markdown with:
1. **What Was Implemented** - Fully functional features
2. **What Was Stubbed** - Placeholder/incomplete code
3. **Outstanding TODOs** - What still needs work
4. **Integration Points** - How this connects to the system
5. **Next Steps** - Suggested follow-up work

### 4. **Index Management**
Updates `.codewiki/summaries/index.json`:
- Summary ID
- Timestamp
- Type (feature/bugfix/refactor)
- Files included
- Summary path

## Examples

### Basic Summary
```bash
memowiki record --files src/auth/*.ts --type feature --output auth-v1
```

Output:
```
📝 Generating summary for 2 files...
   🤖 [openai:gpt-4-turbo-preview] Generating Agent Summary...
✨ Saved summary to .codewiki/summaries/auth-v1.md
```

### Auto-Detect Files
```bash
memowiki record --type bugfix --output fix-login-bug
```

Uses git to find modified and created files.

### Append Mode
```bash
memowiki record --files src/auth/login.ts --append --output auth-v1
```

Adds to existing summary with timestamp separator:

```markdown
# Previous content...

---

## Update: 2025-12-02T12:00:00.000Z

# New implementation summary...
```

### Multiple Summary Types

**Feature implementation:**
```bash
memowiki record --type feature --output user-profile
```

**Bug fix:**
```bash
memowiki record --type bugfix --output fix-auth-token
```

**Refactoring:**
```bash
memowiki record --type refactor --output cleanup-services
```

## Output Structure

```
.codewiki/summaries/
├── index.json                      # Central index
├── auth-v1.md                      # Feature summary
├── fix-login-bug.md                # Bugfix summary
└── cleanup-services.md             # Refactor summary
```

## Summary Format

```markdown
# Feature: User Authentication

**Date**: 2025-12-02  
**Files**: src/auth/login.ts, src/auth/register.ts  
**Type**: Feature

## What Was Implemented
- User login with JWT authentication
- Password hashing with bcrypt
- Session management

## What Was Stubbed
- Password reset functionality (placeholder)
- OAuth integration (TODO)

## Outstanding TODOs
- [ ] Implement password reset email flow
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Add rate limiting to login endpoint

## Integration Points
- Connects to `UserService` for user lookup
- Uses `TokenService` for JWT generation
- Integrates with `EmailService` (stubbed)

## Next Steps
1. Complete password reset flow
2. Add comprehensive tests
3. Implement OAuth
```

## Stub Detection Patterns

The command identifies these stub patterns:

**Empty functions:**
```typescript
function placeholder() {
  // Empty
}
```

**Literal returns:**
```typescript
function getData() {
  return null;  // Stub
}
```

**Not implemented:**
```typescript
function process() {
  throw new Error('Not implemented');
}
```

**Placeholder comments:**
```typescript
function handler() {
  // TODO: Implement this
}
```

## Querying Summaries

See summaries with the [`summaries` command](./summaries.md):

```bash
# Recent summaries
memowiki summaries --recent 5

# By file
memowiki summaries --file src/auth/login.ts

# By type
memowiki summaries --type feature
```

## Use Cases

### For AI Agents
- **Incremental documentation** after each task
- **Work tracking** for what's done vs stubbed
- **Context preservation** for future agents
- **TODO management** explicit list of follow-up work

### For Developers
- **Implementation log** chronological record
- **Reduced manual docs** automatic generation
- **Better handoffs** see implementation rationale
- **Quick lookups** find what was implemented when

## Best Practices

1. **Record after each task** - Keep summaries focused
2. **Use descriptive names** - Make summaries easy to find
3. **Choose correct type** - feature/bugfix/refactor
4. **Use append mode** - For ongoing work on same feature
5. **Review before committing** - Ensure accuracy

## Integration with Workflow

**Post-implementation workflow:**
```bash
# 1. Make code changes
git add src/auth/*.ts

# 2. Record summary
memowiki record --type feature --output auth-implementation

# 3. Commit both code and docs
git commit -m "feat: add authentication"
```

**CI/CD Integration:**
```yaml
# .github/workflows/docs.yml
- name: Record implementation
  run: memowiki record --type feature --output ci-${GITHUB_SHA}
```

## See Also

- [Summaries Command](./summaries.md) - Query summaries
- [Configuration Guide](./configuration.md) - LLM provider setup
