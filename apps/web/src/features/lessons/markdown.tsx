import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

export function LessonMarkdown({ source }: { source: string }) {
  return (
    <div className="lesson-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: async ({ children }) => {
            if (typeof children !== "object" || children === null || !("props" in children))
              return <pre>{children}</pre>;
            const code = children.props as { children?: string; className?: string };
            const language = code.className?.replace("language-", "") ?? "text";
            return <CodeBlock code={String(code.children ?? "")} language={language} />;
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
