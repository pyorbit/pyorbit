# Architecture overview

PyOrbit is one repository with two application processes. The Next.js web app builds public course pages from reviewed Markdown in Git. The FastAPI app owns future account and progress data in PostgreSQL. There is no runtime API dependency for reading lessons.

```text
content/courses → Zod validation → Next.js static lesson pages → browser
browser → /api/v1/* → FastAPI → SQLAlchemy → PostgreSQL
```

The content loader lives in `apps/web/src/lib/content`; routes use `generateStaticParams` and metadata. `packages/types` contains the shared content schema, and `packages/ui` holds generic display primitives. The API separates HTTP routers, settings, database sessions, and models. The initial migration creates users and lesson progress only; no unauthenticated endpoint can modify them.

`GET /api/v1/health` reports process health. It intentionally does not promise database health. FastAPI OpenAPI at `/openapi.json` is the future source for generated TypeScript API types; add generation when a browser-consumed user endpoint exists. Until then, avoid hand-maintained duplicate response contracts.

Public search can first use a static index generated from content titles, headings, and tags at build time. If the catalog outgrows a static index, evaluate PostgreSQL full-text search before adding infrastructure.
