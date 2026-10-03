# Local development

Install Node.js 22, npm, uv, and Docker. From the repository root, copy `.env.example` to `.env` and run `make setup`. The web app reads `NEXT_PUBLIC_SITE_URL` for canonical URLs and the sitemap; set it to the public origin before deployment. The API reads `PYORBIT_*` settings, including JSON-array `PYORBIT_CORS_ORIGINS`. Docker Compose reads `POSTGRES_*` values.

Run `make web` for lessons alone. For API and database work, run `make db-up`, `make migrate`, and `make api`. `make dev` starts both application processes. Stop the database with `make db-down` (the named volume remains). Run `make check` before a pull request.

The default credentials are only for local development. Production must set its own database URL, CORS origins, and site URL. The backend never auto-creates tables; migrations are required. Database tests should use a disposable PostgreSQL database, apply migrations, and roll back each test transaction once repository services are introduced.
