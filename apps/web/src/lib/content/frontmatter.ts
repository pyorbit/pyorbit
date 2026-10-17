import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { parse as parseYaml } from "yaml";

const parser = unified().use(remarkParse).use(remarkFrontmatter, ["yaml"]);

export function parseFrontmatter(source: string): { data: unknown; content: string } {
  const text = source.replace(/^\uFEFF/, ""); // Remove BOM if present
  const first = parser.parse(text).children[0];
  const end = first?.position?.end.offset;

  if (first?.type !== "yaml" || end === undefined) {
    throw new Error("Lesson must start with YAML front matter");
  }

  return {
    data: parseYaml(first.value) as unknown,
    content: text.slice(end).trim(),
  };
}
