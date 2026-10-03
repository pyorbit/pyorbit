import { describe, expect, it } from "vitest";
import { lessonSchema } from "@pyorbit/types";
import { validateMarkdown } from "./catalog";

describe("lesson metadata", () => {
  it("rejects malformed slugs and time estimates", () => {
    const result = lessonSchema.safeParse({
      id: "Bad Slug",
      slug: "bad",
      title: "A title",
      description: "A proper description",
      order: 1,
      difficulty: "beginner",
      estimatedTime: -1,
      prerequisites: [],
      tags: [],
    });
    expect(result.success).toBe(false);
  });
  it("accepts a valid lesson", () => {
    const result = lessonSchema.safeParse({
      id: "hello-python",
      slug: "hello-python",
      title: "Hello, Python",
      description: "A proper description",
      order: 1,
      difficulty: "beginner",
      estimatedTime: 5,
      prerequisites: [],
      tags: [],
    });
    expect(result.success).toBe(true);
  });
});

describe("lesson body", () => {
  it("rejects HTML and dangerous links without rejecting Python comparisons", () => {
    expect(() =>
      validateMarkdown("```python\nif score < 5:\n    pass\n```", "example"),
    ).not.toThrow();
    expect(() => validateMarkdown("<script>alert(1)</script>", "example")).toThrow();
    expect(() => validateMarkdown("[run](javascript:alert(1))", "example")).toThrow();
  });
});
