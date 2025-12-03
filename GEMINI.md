# MemoWiki Project Overview

MemoWiki is a powerful tool designed to act as a persistent memory layer for your codebase. It automates documentation generation using Large Language Models (LLMs), provides semantic search capabilities, and generates agent-driven summaries. The project aims to keep documentation searchable and up-to-date automatically, minimizing API usage through intelligent caching.

## Key Features:
*   **Automated Documentation**: Generates documentation, diagrams (Mermaid class and architecture), and summaries from code using LLM analysis.
*   **Semantic Search**: Offers natural language code search powered by vector embeddings.
*   **Agent Summaries**: Tracks AI agent implementation progress.
*   **Smart Caching**: Reduces redundant API calls.
*   **Git Integration**: Automatically detects changes and tracks history.
*   **Multi-LLM Support**: Compatible with OpenAI, Anthropic, Gemini, OpenRouter, and Ollama.
*   **REST API**: Exposes functionality for IDE and CI integrations.
*   **Web Dashboard**: Provides a visual interface for monitoring and management.

## Technologies Used:
*   **Backend**: TypeScript, Node.js.
*   **Frontend (Dashboard)**: Angular.
*   **LLMs**: Integration with various LLM providers.
*   **Database**: ChromaDB (optional, for semantic search).
*   **Version Control**: Git.

## Building and Running:

### Installation
```bash
npm install -g memowiki
```

### Configuration
Create a `.env` file at the root of the project to configure LLM providers. Example:
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```
For more details, refer to `docs/configuration.md`.

### Build Commands
*   **Build Backend Only**: `npm run build`
*   **Build Dashboard Only**: `npm run build:dashboard`
*   **Build Both Backend and Dashboard**: `npm run build:all`

### Running the Application
*   **Start API Server (with integrated dashboard)**:
    ```bash
    memowiki serve
    # Access dashboard at http://localhost:3000
    ```
*   **Development Mode (Backend API with live reload)**:
    *   The `dev:serve` script uses `nodemon` to automatically restart the server on file changes. 
    ```bash
    npm run dev:serve
    # Access at http://localhost:3000
    ```
    *   For dashboard development with hot-reload, follow these steps:
        1.  **Terminal 1 (Backend API)**:
            ```bash
            npm run dev:serve
            ```
        2.  **Terminal 2 (Dashboard with hot-reload)**:
            ```bash
            cd dashboard
            ng serve
            # Access at http://localhost:4200
            ```

### Core CLI Usage Examples
*   **Generate Documentation**: `memowiki update`
*   **Record Agent Summary**: `memowiki record --type feature --output my-feature`
*   **Query Summaries**: `memowiki summaries --recent 5`
*   **Search Code**: `memowiki search "authentication logic"`
*   **Analyze Repository**: `memowiki analyze`

## Development Conventions:

*   **Language**: TypeScript is used throughout the project.
*   **Configuration**: Environment variables are managed via a `.env` file.
*   **Output Structure**: Generated documentation, diagrams, flows, and summaries are stored within the `.codewiki/` directory.
*   **Git**: The system is heavily integrated with Git for change detection and history tracking.
*   **Testing**: (Further investigation would be needed to detail specific testing practices, but `app.spec.ts` files indicate Angular unit tests).
