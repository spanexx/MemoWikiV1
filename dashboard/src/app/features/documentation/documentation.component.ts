import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardApiService } from '../../core/services/dashboard-api.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

export interface DocumentationItem {
    id: string;
    title: string;
    description: string;
    category: string;
    content: string;
    lastUpdated: Date;
    tags: string[];
}

@Component({
    selector: 'app-documentation',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        LoadingSpinnerComponent,
        ErrorMessageComponent,
        EmptyStateComponent
    ],
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
    Math = Math; // Expose Math to template

    allDocs: DocumentationItem[] = [];
    filteredDocs: DocumentationItem[] = [];
    paginatedDocs: DocumentationItem[] = [];

    loading = false;
    error: string | null = null;

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 0;

    // Filters
    searchTerm = '';
    categoryFilter = '';
    categories: string[] = [];

    constructor(private dashboardApi: DashboardApiService) { }

    ngOnInit(): void {
        this.loadDocumentation();
    }

    loadDocumentation(): void {
        this.loading = true;
        this.error = null;

        // Load documentation from markdown files in /docs directory
        // For now, we'll use mock data since the API endpoint doesn't exist yet
        this.loadMockData();
    }

    loadMockData(): void {
        // Mock documentation data
        this.allDocs = [
            {
                id: '1',
                title: 'Getting Started',
                description: 'Learn how to get started with MemoWiki',
                category: 'Guide',
                content: 'Welcome to MemoWiki...',
                lastUpdated: new Date('2024-11-30'),
                tags: ['beginner', 'setup']
            },
            {
                id: '2',
                title: 'CLI Commands',
                description: 'Complete reference for all CLI commands',
                category: 'Reference',
                content: 'MemoWiki provides several CLI commands...',
                lastUpdated: new Date('2024-12-01'),
                tags: ['cli', 'commands']
            },
            {
                id: '3',
                title: 'Configuration',
                description: 'How to configure MemoWiki for your project',
                category: 'Guide',
                content: 'Configuration options...',
                lastUpdated: new Date('2024-11-28'),
                tags: ['config', 'setup']
            },
            {
                id: '4',
                title: 'LLM Providers',
                description: 'Integrate different LLM providers',
                category: 'Integration',
                content: 'MemoWiki supports multiple LLM providers...',
                lastUpdated: new Date('2024-12-02'),
                tags: ['llm', 'providers']
            },
            {
                id: '5',
                title: 'API Reference',
                description: 'Complete API documentation',
                category: 'Reference',
                content: 'API endpoints and usage...',
                lastUpdated: new Date('2024-11-29'),
                tags: ['api', 'reference']
            }
        ];

        this.categories = [...new Set(this.allDocs.map(d => d.category))];
        this.filteredDocs = [...this.allDocs];
        this.updatePagination();
        this.loading = false;
    }

    filterDocs(): void {
        this.filteredDocs = this.allDocs.filter(doc => {
            const matchesSearch = !this.searchTerm ||
                doc.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                doc.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                doc.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));

            const matchesCategory = !this.categoryFilter || doc.category === this.categoryFilter;

            return matchesSearch && matchesCategory;
        });

        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination(): void {
        this.totalPages = Math.ceil(this.filteredDocs.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedDocs = this.filteredDocs.slice(startIndex, endIndex);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePagination();
        }
    }

    nextPage(): void {
        this.goToPage(this.currentPage + 1);
    }

    previousPage(): void {
        this.goToPage(this.currentPage - 1);
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxPages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
