# PyOrbit

**Learn Python. Understand it. Build with it.**

PyOrbit is an early-stage, open-source platform for learning Python. Today it has a small Git-backed sample course, a server-rendered lesson reader, and a versioned FastAPI foundation. Exercises, accounts, synced progress, search, and browser Python execution are planned. The `/preview` route preserves the original interactive design prototype; its editor does not run or grade Python.

## Principles

Lessons belong in Git and are reviewed through pull requests. Public reading stays accessible without an account. The web app renders educational content; the API is reserved for user data. Arbitrary Python is never executed in the API process.

## Stack and structure

- `apps/web`: Next.js 16, React 19, TypeScript, Tailwind CSS 4; static lesson pages and metadata.
- `apps/api`: Python 3.13, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, PostgreSQL, uv.
- `packages/types`: Zod metadata contracts; `packages/ui`: reusable display primitives; `packages/config`: TypeScript base configuration.
- `content/courses`: Markdown lesson bodies and YAML metadata in Git.
- `docs`: architecture, authoring, security, and development guides.
- `compose.yaml`: local PostgreSQL only.

See the [architecture overview](docs/architecture/overview.md) and [decision records](docs/adr/).

## Quick start

Requires Node.js 22, npm, uv, and Docker for database-backed work.

```sh
git clone https://github.com/pyorbit/pyorbit.git
cd pyorbit
cp .env.example .env
make setup
make db-up
make migrate
make dev
```

Open `http://localhost:3000` for the website and `http://localhost:8000/docs` for API docs. The web lessons work without PostgreSQL; `make db-up` and `make migrate` establish the user-data schema.

## Common commands

| Command | Purpose |
| --- | --- |
| `make web` / `make api` | Start one application |
| `make dev` | Start both applications |
| `make content` | Validate course and lesson metadata |
| `make test` / `make lint` / `make typecheck` | Run focused checks |
| `make format` | Format TypeScript, CSS, and Python code |
| `make check` | Run web and API checks, including production web build |
| `make db-up` / `make db-down` | Start or stop PostgreSQL |
| `make migrate` | Apply Alembic migrations |

To create a migration after changing SQLAlchemy models: `cd apps/api && uv run alembic revision --autogenerate -m "describe change"`; review the generated file before applying it. More setup details are in [docs/development/setup.md](docs/development/setup.md).

## Contribute

Start with the [contribution guide](CONTRIBUTING.md) or the [content authoring guide](docs/content/authoring.md). Content validation runs in CI and reports the file and metadata field when a schema fails. The sample course demonstrates the format.

## Status and roadmap

The current content and API are foundations. Next useful milestone: finish the first complete beginner course and add real client-side Pyodide execution behind the documented executor interface. Account creation, progress synchronization, and server-side runners require separate design and security work.

## License and maintainers

MIT, see [LICENSE](LICENSE). Maintainers: Minkin and Rakitin.
