import { GitService } from '../observer/git-service';
import { LLMService } from '../builder/llm-service';
import { Config } from '../config/config';

export enum IntentType {
    BUG_FIX = 'bug_fix',
    FEATURE = 'feature',
    REFACTOR = 'refactor',
    OPTIMIZATION = 'optimization',
    DOCUMENTATION = 'documentation',
    UNKNOWN = 'unknown',
}

export interface IntentAnalysis {
    intent: IntentType;
    confidence: number;
    summary: string;
    suggestions: string[];
}

export class IntentAnalyzer {
    private gitService: GitService;
    private llmService: LLMService;

    constructor(private config: Config) {
        this.gitService = new GitService();
        this.llmService = new LLMService(config);
    }

    async analyzeCurrentChanges(): Promise<IntentAnalysis> {
        const gitState = await this.gitService.getGitState();

        // Get diff for modified files
        const changes = gitState.status.modified;

        if (changes.length === 0) {
            return {
                intent: IntentType.UNKNOWN,
                confidence: 1.0,
                summary: 'No changes detected',
                suggestions: [],
            };
        }

        // Pattern-based classification (simple heuristics)
        const intent = this.classifyByPatterns(changes);

        // TODO: Use LLM for more sophisticated analysis
        // For now, return pattern-based classification
        return {
            intent,
            confidence: 0.7,
            summary: this.generateSummary(intent, changes.length),
            suggestions: this.generateSuggestions(intent),
        };
    }

    private classifyByPatterns(files: string[]): IntentType {
        // Simple heuristics based on file patterns
        const hasTest = files.some(f => f.includes('.test.') || f.includes('.spec.'));
        const hasDoc = files.some(f => f.endsWith('.md'));
        const hasNewFiles = files.length > 3;

        if (hasDoc && files.length === 1) return IntentType.DOCUMENTATION;
        if (hasTest) return IntentType.BUG_FIX;
        if (hasNewFiles) return IntentType.FEATURE;

        return IntentType.REFACTOR;
    }

    private generateSummary(intent: IntentType, fileCount: number): string {
        const intentNames = {
            [IntentType.BUG_FIX]: 'Bug fix',
            [IntentType.FEATURE]: 'New feature',
            [IntentType.REFACTOR]: 'Code refactoring',
            [IntentType.OPTIMIZATION]: 'Performance optimization',
            [IntentType.DOCUMENTATION]: 'Documentation update',
            [IntentType.UNKNOWN]: 'Unknown changes',
        };

        return `${intentNames[intent]} affecting ${fileCount} file${fileCount > 1 ? 's' : ''}`;
    }

    private generateSuggestions(intent: IntentType): string[] {
        const suggestions: Record<IntentType, string[]> = {
            [IntentType.BUG_FIX]: [
                'Add test cases to prevent regression',
                'Update documentation if behavior changed',
                'Consider adding error logging',
            ],
            [IntentType.FEATURE]: [
                'Add documentation for new functionality',
                'Create tests for new features',
                'Update README if user-facing',
            ],
            [IntentType.REFACTOR]: [
                'Ensure all tests still pass',
                'Update comments if needed',
                'Consider performance implications',
            ],
            [IntentType.OPTIMIZATION]: [
                'Benchmark before and after',
                'Document performance improvements',
                'Check for edge cases',
            ],
            [IntentType.DOCUMENTATION]: [
                'Ensure examples are up to date',
                'Check for broken links',
            ],
            [IntentType.UNKNOWN]: [],
        };

        return suggestions[intent] || [];
    }
}
