.PHONY: setup dev web api test lint format typecheck check db-up db-down migrate content
-include .env
export NEXT_PUBLIC_SITE_URL
setup:
	npm ci
	cd apps/api && uv sync
web:
	npm run dev
api:
	cd apps/api && uv run uvicorn pyorbit.main:app --reload
dev:
	$(MAKE) -j2 web api
content:
	npm run content:validate
test:
	npm run test
	cd apps/api && uv run pytest
lint:
	npm run lint
	cd apps/api && uv run ruff check .
format:
	npm run format:web
	cd apps/api && uv run ruff format .
typecheck:
	npm run typecheck
	cd apps/api && uv run mypy src
check:
	npm run check
	cd apps/api && uv run ruff check . && uv run ruff format --check . && uv run mypy src && uv run pytest
db-up:
	docker compose up -d postgres
db-down:
	docker compose down
migrate:
	cd apps/api && uv run alembic upgrade head
