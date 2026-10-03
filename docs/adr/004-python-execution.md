# ADR 004: Python execution strategy

**Status:** Accepted

The first real executor should use Pyodide in a dedicated browser worker, loaded only for interactive lessons. UI code will depend on a `PythonExecutor` interface with `execute(code): Promise<ExecutionResult>`; results include stdout, stderr, status, and duration. The current preview does not execute code.

If server execution becomes necessary, the path is web → API → queue → isolated sandbox runner. The runner must enforce CPU, memory, time, output, filesystem, and network restrictions; it must not receive database credentials or host Docker access. No user code runs in FastAPI or its container.
