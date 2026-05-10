# Blog Monorepo

Monorepo for a blog application with:

- `backend`: Fastify + tRPC + Drizzle ORM + SQLite
- `frontend`: React + Vite + Tailwind CSS + Heroicons
- `shared`: shared schemas/types

## Workspace

This repository uses **pnpm workspaces**.

- Workspace config: `pnpm-workspace.yaml`
- Root scripts are in `package.json`

## Requirements

- Node.js 20+
- pnpm 9+

## Install

```bash
pnpm install
```

## Development

Run backend and frontend together:

```bash
pnpm run dev
```

Run only backend:

```bash
pnpm run dev:backend
```

Run only frontend:

```bash
pnpm run dev:frontend
```

## Quality Checks

Typecheck all packages:

```bash
pnpm run typecheck
```

Build all packages:

```bash
pnpm run build
```

Run tests:

```bash
pnpm run test
```

Run lint:

```bash
pnpm run lint
```

## Project Structure

```text
.
├── backend/
├── frontend/
├── shared/
├── pnpm-workspace.yaml
└── package.json
```

## Notes

- Frontend styling is based on Tailwind CSS.
- UI direction follows Tailwind UI Catalyst patterns.
- Icons use `@heroicons/react`.
