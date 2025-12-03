# Intent Command

## Overview

The `intent` command analyzes your current code changes and determines the intent behind them. It classifies changes as bug fixes, features, refactors, etc., and provides actionable suggestions.

## Usage

```bash
memowiki intent
```

## No Options
This command has no options. It analyzes all current uncommitted changes.

## How It Works

### 1. **Change Detection**
- Reads modified files from git status
- Analyzes file patterns and content
- Considers file types and naming conventions

### 2. **Intent Classification**
Classifies changes into:
- **Bug Fix** - Fixing existing issues
- **Feature** - New functionality
- **Refactor** - Code restructuring
- **Optimization** - Performance improvements
- **Documentation** - Doc updates only
- **Unknown** - Unclear intent

### 3. **Suggestion Generation**
Provides context-aware suggestions:
- What to document
- What tests to add
- What to review

## Examples

### Basic Usage
```bash
memowiki intent
```

Output:
```
🔍 Analyzing intent of current changes...

Intent: feature
Confidence: 85%
Summary: New feature affecting 3 files

Suggestions:
  1. Add documentation for new functionality
  2. Create tests for new features
  3. Update README if user-facing
```

### Different Intent Types

**Bug Fix:**
```
Intent: bug_fix
Confidence: 92%
Summary: Bug fix affecting 1 file

Suggestions:
  1. Add test cases to prevent regression
  2. Update documentation if behavior changed
  3. Consider adding error logging
```

**Refactor:**
```
Intent: refactor
Confidence: 78%
Summary: Code refactoring affecting 5 files

Suggestions:
  1. Ensure all tests still pass
  2. Update comments if needed
  3. Consider performance implications
```

**Documentation:**
```
Intent: documentation
Confidence: 100%
Summary: Documentation update affecting 1 file

Suggestions:
  1. Ensure examples are up to date
  2. Check for broken links
```

## Intent Classification Rules

### Bug Fix
Detected when:
- Files contain `.test.` or `.spec.`
- Commit messages mention "fix", "bug", "issue"
- Small number of files changed
- Defensive code patterns added

### Feature
Detected when:
- Multiple new files created
- Significant code additions
- New exports added
- Schema/interface changes

### Refactor
Detected when:
- Code moved between files
- Function/class renaming
- No functional changes
- Structure improvements

### Optimization
Detected when:
- Performance-related changes
- Caching added
- Algorithm improvements
- Resource usage reduction

### Documentation
Detected when:
- Only `.md` files changed
- Comment updates only
- README modifications

## Confidence Scores

| Score | Meaning | Action |
|-------|---------|--------|
| 90-100% | Very confident | Trust classification |
| 70-89% | Confident | Probably correct |
| 50-69% | Uncertain | Verify intent |
| 0-49% | Low confidence | Manual classification recommended |

## Use Cases

### Pre-Commit Review
```bash
# Check intent before committing
memowiki intent

# Verify suggestions
git diff

# Commit with appropriate message
git commit -m "feat: add authentication"
```

### Automated Documentation
```bash
# Analyze intent
INTENT=$(memowiki intent | grep "Intent:" | cut -d' ' -f2)

# Record appropriate summary
memowiki record --type $INTENT
```

### Code Review Prep
```bash
# Analyze changes
memowiki intent

# Generate documentation
memowiki update

# Create summary
memowiki record --type feature
```

## Integration

### Programmatic Access
```typescript
import { IntentAnalyzer } from 'memowiki';
import { configManager } from 'memowiki';

const config = configManager.getConfig();
const analyzer = new IntentAnalyzer(config);

const analysis = await analyzer.analyzeCurrentChanges();

console.log('Intent:', analysis.intent);
console.log('Confidence:', analysis.confidence);
console.log('Summary:', analysis.summary);
analysis.suggestions.forEach(s => console.log('-', s));
```

### Custom Intent Logic
```typescript
// Override classification
class CustomAnalyzer extends IntentAnalyzer {
  protected classifyByPatterns(files: string[]): IntentType {
    // Custom rules
    if (files.some(f => f.includes('migration'))) {
      return IntentType.REFACTOR;
    }
    return super.classifyByPatterns(files);
  }
}
```

## Git Integration

### Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Analyzing commit intent..."
memowiki intent

read -p "Does this classification look correct? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  exit 1
fi
```

### Commit Message Template
```bash
# Based on intent
INTENT=$(memowiki intent | grep "Intent:" | awk '{print $2}')

case $INTENT in
  "bug_fix")
    PREFIX="fix: "
    ;;
  "feature")
    PREFIX="feat: "
    ;;
  "refactor")
    PREFIX="refactor: "
    ;;
  *)
    PREFIX="chore: "
    ;;
esac

git commit -m "${PREFIX}your message here"
```

## Advanced Features

### LLM-Enhanced Analysis
Future enhancement - use LLM to analyze:
- Code diff content
- Variable naming patterns
- Comment changes
- Import additions

### Multi-File Tracking
Track intent across:
- Related files
- Module boundaries
- Feature groupings

## Limitations

Current implementation uses pattern-based classification:
- May misclassify complex changes
- Doesn't understand code semantics
- Limited to file-level patterns

Future LLM integration will improve:
- Code-level understanding
- Contextual analysis
- Multi-file relationship tracking

## See Also

- [Record Command](./record.md) - Create summaries based on intent
- [Analyze Command](./analyze.md) - Repository analysis
- [Update Command](./update.md) - Generate documentation
