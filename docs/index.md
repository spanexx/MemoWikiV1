# MemoWiki

A persistent memory layer and agent for your codebase.

- Turn your repository into a long‑term memory store
- Run an API server for your own tools and dashboards
- Get semantic search over your code via ChromaDB
- Generate summaries, intent analysis, and more

## Install

```bash
npm install -g memowiki
```

Or run on demand:

```bash
npx memowiki@latest --help
```

## Quick Start

1. **Configure environment**
   - Create a `.env` in your project
   - Set at least:

     ```bash
     LLM_PROVIDER=openai
     OPENAI_API_KEY=sk-...
     ENABLE_SEMANTIC_SEARCH=true
     CHROMA_URL=http://localhost:8000
     ```

2. **Start ChromaDB** (local vector DB)
3. **Run an initial update** from your project root:

```bash
memowiki update --full
```

This scans your code, talks to the LLM, and writes structured summaries into `.codewiki/`.

## Core Commands

See the detailed pages in the sidebar for examples.

- `memowiki update` – scan code and refresh the wiki
- `memowiki search` – semantic search over your code
- `memowiki summaries` – query stored implementation summaries
- `memowiki serve` – start the Agent API + dashboard backend
- `memowiki analyze` – git insights
- `memowiki record` – manually record an implementation summary
- `memowiki intent` – explain the intent of your current changes

## Dashboard

Run the Agent API server and open the dashboard:

```bash
memowiki serve -p 3000
# then open http://localhost:3000
```

The dashboard shows:

- Recent activity and scans
- File‑level summaries and status
- Semantic search results (when enabled)
- LLM configuration controls

## Configuration & Docs

- **Configuration**: see the *Configuration* page for all `.env` options.
- **CLI Usage**: each command has its own page under *CLI Commands*.
- **Dashboard**: screenshots and flows on the *Dashboard* page.

For full details, browse the rest of the docs in the sidebar.
