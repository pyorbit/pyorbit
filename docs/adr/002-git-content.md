# ADR 002: Educational content in Git

**Status:** Accepted

Courses are Markdown files and YAML metadata reviewed through pull requests. Zod validation runs before build. Raw HTML and MDX JavaScript are excluded; a small set of approved interactive components can be added later. This keeps lessons portable, versioned, and independent of a proprietary CMS. Lesson bodies are not copied into PostgreSQL.
