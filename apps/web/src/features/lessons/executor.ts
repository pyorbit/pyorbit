/** Contract for a future worker-backed Pyodide implementation. No executor is wired yet. */
export interface ExecutionResult {
  stdout: string;
  stderr: string;
  result?: string;
  executionTimeMs: number;
  status: "ok" | "error" | "timeout";
}
export interface PythonExecutor {
  execute(code: string): Promise<ExecutionResult>;
}
