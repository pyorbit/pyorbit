import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";

describe("YAML front matter", () => {
  it("reads metadata and preserves separators in the body", () => {
    const result = parseFrontmatter("---\ntitle: Hello\norder: 1\n---\n# Lesson\n\n---\n\nText");
    expect(result.data).toEqual({ title: "Hello", order: 1 });
    expect(result.content).toBe("# Lesson\n\n---\n\nText");
  });

  it("supports BOM and Windows line endings", () => {
    const result = parseFrontmatter("\uFEFF---\r\ntitle: Hello\r\n---\r\nBody");
    expect(result.data).toEqual({ title: "Hello" });
    expect(result.content).toBe("Body");
  });

  it.each(["", "# No metadata", "---\ntitle: Missing end"])(
    "rejects absent or unclosed metadata: %j",
    (source) => {
      expect(() => parseFrontmatter(source)).toThrow("Lesson must start with YAML front matter");
    },
  );

  it("rejects invalid YAML", () => {
    expect(() => parseFrontmatter("---\ntitle: [broken\n---\nBody")).toThrow();
  });

  it("returns an empty body for later catalog validation", () => {
    expect(parseFrontmatter("---\ntitle: Hello\n---\n").content).toBe("");
  });
});
