# ADR 001: One repository, two applications

**Status:** Accepted

PyOrbit uses npm workspaces for the Next.js app and shared TypeScript packages, plus a separate uv project for FastAPI. Git content and docs stay at the root. This keeps contributor workflows coherent while preserving a clear deployment boundary between web and API. No task runner or microservice framework is needed yet.
