import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileIcon',
    standalone: true
})
export class FileIconPipe implements PipeTransform {
    transform(path: string): string {
        const ext = path.split('.').pop()?.toLowerCase();

        const iconMap: Record<string, string> = {
            'ts': '📘',
            'js': '📙',
            'tsx': '⚛️',
            'jsx': '⚛️',
            'json': '📋',
            'md': '📝',
            'css': '🎨',
            'scss': '🎨',
            'html': '🌐',
            'py': '🐍',
            'java': '☕',
            'go': '🔷',
            'rs': '🦀',
            'rb': '💎',
            'php': '🐘',
            'sql': '🗄️',
            'sh': '⚙️',
            'yaml': '📄',
            'yml': '📄',
            'xml': '📄',
            'env': '🔐'
        };

        return iconMap[ext || ''] || '📄';
    }
}
