import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";

export async function CodeBlock({
  code,
  language = "python",
  title,
  highlightedLines = [],
  showLineNumbers = false,
}: {
  code: string;
  language?: string;
  title?: string;
  highlightedLines?: number[];
  showLineNumbers?: boolean;
}) {
  const html = await codeToHtml(code.trimEnd(), {
    lang: language === "python" ? "python" : "text",
    themes: { light: "github-light", dark: "github-dark" },
    transformers: [
      {
        line(node, line) {
          if (highlightedLines.includes(line)) this.addClassToHast(node, "highlighted");
        },
      },
    ],
  });
  return (
    <figure className={`code-block${showLineNumbers ? " code-block--numbered" : ""}`}>
      <figcaption>
        <span>{title ?? language}</span>
        <CopyButton code={code.trimEnd()} />
      </figcaption>
      <div className="code-scroll" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
