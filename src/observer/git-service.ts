import simpleGit, { SimpleGit } from 'simple-git';
import { GitState, GitStatus } from '../types';

/**
 * Service for interacting with Git repositories
 * Provides methods to get git status, recent commits, and other git-related information
 */
export class GitService {
    private git: SimpleGit;

    /**
     * Creates a new GitService instance
     * @param baseDir - The base directory for git operations (defaults to current working directory)
     */
    constructor(baseDir: string = process.cwd()) {
        this.git = simpleGit(baseDir);
    }

    /**
     * Gets the current git state including status, diff, and recent commit information
     * @returns A promise that resolves to a GitState object
     */
    async getGitState(): Promise<GitState> {
        const statusSummary = await this.git.status();
        const diff = await this.git.diff();
        const log = await this.git.log({ maxCount: 1 });

        const branchSummary = await this.git.branch();
        const status = await this.git.status(); // Re-fetch status for conflict info

        const branchInfo = {
            current: branchSummary.current,
            upstream: status.tracking || undefined,
            ahead: status.ahead,
            behind: status.behind,
        };

        const recentCommit = log.latest ? {
            hash: log.latest.hash,
            date: log.latest.date,
            message: log.latest.message,
            author_name: log.latest.author_name,
        } : null;

        return {
            status: {
                modified: statusSummary.modified,
                created: statusSummary.created,
                deleted: statusSummary.deleted,
                renamed: statusSummary.renamed.map(r => ({ from: r.from, to: r.to })),
            },
            diff,
            recentCommit,
            branch: branchInfo,
            conflicts: status.conflicted,
        };
    }

    /**
     * Checks if the current directory is a git repository
     * @returns A promise that resolves to true if the directory is a git repository, false otherwise
     */
    async isRepo(): Promise<boolean> {
        return this.git.checkIsRepo();
    }
}
