# Foundation threat model

Educational Markdown is treated as untrusted until reviewed. Metadata is schema-validated; raw HTML and unsafe URL schemes are rejected; the renderer does not enable raw HTML or MDX JavaScript. Content changes require code review. External links should be checked during review.

The API never executes submitted Python. Browser execution, when added, will run in a Pyodide worker with time/output limits and no access to credentials. A future server runner must be a separate isolated worker behind a queue: strict CPU/memory/time/output limits, network disabled by default, temporary workspace, read-only base filesystem where possible, no Docker socket, and no database credentials. The API must never spawn a shell for user code.

No auth endpoints exist yet. Future sessions should use Secure, HttpOnly, SameSite cookies and CSRF protection for state-changing requests. Passwords must be hashed using a current password hashing library, never stored directly. CORS is environment-controlled. SQLAlchemy parameters prevent string-concatenated SQL. Secrets belong in environment or a secret manager, never Git. CI audits production npm dependencies and keeps Python dependencies locked.
