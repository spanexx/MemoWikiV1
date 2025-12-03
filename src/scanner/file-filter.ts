import * as fs from 'fs';
import * as path from 'path';

export class FileFilter {
    private defaultExclusions: string[] = [
        'node_modules',
        'dist',
        'build',
        'coverage',
        '.git',
        '.next',
        '.nuxt',
        '.angular',
        'out',
        'target',
        'bin',
        'obj',
        '__pycache__',
        '.venv',
        'venv',
        '.codewiki',
    ];

    private customExclusions: string[] = [];
    private supportedExtensions: string[] = ['.ts', '.js', '.tsx', '.jsx'];
    private baseDir: string;

    constructor(baseDir: string = process.cwd()) {
        this.baseDir = baseDir;
        this.loadMemowikiIgnore();
    }

    private loadMemowikiIgnore() {
        const ignorePath = path.join(this.baseDir, '.memowikiignore');
        if (fs.existsSync(ignorePath)) {
            const content = fs.readFileSync(ignorePath, 'utf-8');
            this.customExclusions = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));
        }
    }

    shouldIncludeFile(filePath: string): boolean {
        const relativePath = path.relative(this.baseDir, filePath);

        // Check file extension
        const ext = path.extname(filePath);
        if (!this.supportedExtensions.includes(ext)) {
            return false;
        }

        // Check default exclusions
        for (const exclusion of this.defaultExclusions) {
            if (relativePath.includes(exclusion + path.sep) || relativePath.startsWith(exclusion)) {
                return false;
            }
        }

        // Check custom exclusions
        for (const pattern of this.customExclusions) {
            if (this.matchesPattern(relativePath, pattern)) {
                return false;
            }
        }

        return true;
    }

    private matchesPattern(filePath: string, pattern: string): boolean {
        // Simple glob pattern matching
        // Supports: * (any chars), ** (any path), ? (single char)

        // Convert glob to regex
        let regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '___DOUBLESTAR___')
            .replace(/\*/g, '[^/]*')
            .replace(/___DOUBLESTAR___/g, '.*')
            .replace(/\?/g, '.');

        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(filePath);
    }

    filterFiles(files: string[]): string[] {
        return files.filter(file => this.shouldIncludeFile(file));
    }
}
