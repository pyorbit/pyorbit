# Foundation plan

## Repository audit (2026-10-03)

The repository is a Next.js 15 / React 19 / Tailwind 4 application with one Russian-language client page. It includes a responsive lesson editor, search, tabs, and a text-fragment answer check. There is no persisted content, real Python execution, API, database, or tests. The progress and streak shown on the page are sample data. The README is a starter placeholder. CI currently checks only the web application. `public/` contains only Next.js starter SVGs; no PyOrbit logo is present. The modified `LICENSE` predates this migration and will be retained as-is.

Dependencies already present: Next.js 15.5, React 19.1, TypeScript 5, Tailwind 4, ESLint 9, and Lucide. Security advisories required upgrading Next.js to 16.3.8 and React to 19.3 during the migration; the other existing major versions remain. Python 3.13 is supported by the selected FastAPI/Pydantic/SQLAlchemy stack; uv supplies the interpreter.

The Next.js ESLint preset pulled in an unpatched development dependency advisory. ESLint now uses TypeScript, React Hooks, and JSX accessibility rules directly; the full npm audit passes on the locked tree.

## Target tree

```text
apps/web/              Next.js App Router, routes and server content reader
apps/api/              FastAPI package, Alembic migrations, tests
packages/ui/           reusable presentation primitives
packages/config/       shared TypeScript configuration
packages/types/        versioned content metadata schemas
content/courses/       reviewed Markdown lessons in Git
docs/                  architecture, authoring, development, security
infra/                 reserved for deployment assets when needed
.github/workflows/     independent web and API checks
```

`infra/` will be created only when a concrete infrastructure file is needed. PostgreSQL lives in root `compose.yaml` for local development.

## Boundaries and flows

- **Frontend:** `app/` owns routing and metadata, `features/` owns domain views, `components/` owns shell elements, `lib/content/` owns server-only file access. `packages/ui` has generic presentation primitives only. Server components remain the default.
- **Backend:** `pyorbit.main` creates the app; `core/` owns settings/logging, `api/v1/` owns HTTP, `db/` owns sessions, `models/` owns persisted user data. API responses are versioned; educational bodies remain outside PostgreSQL.
- **Public content:** contributor PR → schema validation → reviewed Markdown → static Next.js routes and metadata. Markdown does not execute JSX or raw HTML. Code highlighting runs on the server.
- **User data:** browser → versioned API → SQLAlchemy transaction → PostgreSQL. Accounts and progress endpoints await a real auth design; initial database stores only the minimum account/progress schema.
- **Development:** `npm ci` and `uv sync` install separate toolchains. Docker Compose starts PostgreSQL. Make targets coordinate local development and checks. CI uses lockfiles and does not need production credentials.

## Migration risks

- The current lesson page claims completion from string matching; retain its useful layout/interaction as a labeled preview while removing misleading evaluation and metrics.
- Monorepo path changes can break Next.js tracing and content reads; production build and route checks will verify paths.
- Markdown from public contributions can contain unsafe HTML/JSX; accept Markdown only, reject raw HTML and unsafe links, and render with an allowlist.
- A database model before authentication should not expose user data; no account CRUD API is added yet.
