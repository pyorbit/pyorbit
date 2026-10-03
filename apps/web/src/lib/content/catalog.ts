import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { courseSchema, lessonSchema, type Course, type Lesson } from "@pyorbit/types";
import { z } from "zod";

export type LessonEntry = { metadata: Lesson; body: string };
export type CourseEntry = { metadata: Course; lessons: LessonEntry[] };
const contentRoot = path.resolve(process.cwd(), "../../content/courses");
let catalogCache: CourseEntry[] | undefined;
type MarkdownNode = { type: string; url?: string; children?: MarkdownNode[] };

export function validateMarkdown(body: string, file: string): void {
  const tree = unified().use(remarkParse).parse(body) as MarkdownNode;
  const pending = [tree];
  while (pending.length) {
    const node = pending.pop();
    if (!node) continue;
    if (node.type === "html") throw new Error(`${file}: raw HTML and MDX tags are not allowed`);
    if (node.url && /^(?:javascript|data|vbscript):/i.test(node.url.trim())) {
      throw new Error(`${file}: unsafe URL scheme is not allowed`);
    }
    pending.push(...(node.children ?? []));
  }
}

function parseFile<T>(file: string, schema: z.ZodType<T>): T {
  const text = readFileSync(file, "utf8");
  const parsed = file.endsWith(".md") ? matter(text).data : matter(`---\n${text}\n---`).data;
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`${path.relative(contentRoot, file)}: ${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export function getCatalog(): CourseEntry[] {
  if (process.env.NODE_ENV !== "development" && catalogCache) return catalogCache;
  const courses = readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((directory) => {
      const courseDir = path.join(contentRoot, directory.name);
      const metadata = parseFile(path.join(courseDir, "course.yaml"), courseSchema);
      if (metadata.slug !== directory.name || metadata.id !== metadata.slug) {
        throw new Error(`${directory.name}/course.yaml: id and slug must match the directory`);
      }
      const lessons = readdirSync(courseDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => {
          const file = path.join(courseDir, entry.name, "lesson.md");
          const lesson = parseFile(file, lessonSchema);
          const body = matter(readFileSync(file, "utf8")).content.trim();
          if (!body) throw new Error(`${file}: lesson body must not be empty`);
          if (entry.name !== `${String(lesson.order).padStart(2, "0")}-${lesson.slug}`) {
            throw new Error(`${file}: directory must match lesson order and slug`);
          }
          if (lesson.id !== lesson.slug) throw new Error(`${file}: id and slug must match`);
          return { metadata: lesson, body };
        })
        .sort((a, b) => a.metadata.order - b.metadata.order);
      const ids = new Set(lessons.map((lesson) => lesson.metadata.id));
      const orders = new Set(lessons.map((lesson) => lesson.metadata.order));
      if (lessons.length === 0)
        throw new Error(`${directory.name}: course needs at least one lesson`);
      if (ids.size !== lessons.length || orders.size !== lessons.length)
        throw new Error(`${directory.name}: duplicate lesson id or order`);
      for (const lesson of lessons) {
        for (const prerequisite of lesson.metadata.prerequisites) {
          if (!ids.has(prerequisite))
            throw new Error(`${lesson.metadata.slug}: unknown prerequisite ${prerequisite}`);
        }
        validateMarkdown(lesson.body, lesson.metadata.slug);
      }
      return { metadata, lessons };
    })
    .sort((a, b) => a.metadata.order - b.metadata.order);
  const ids = new Set(courses.map((course) => course.metadata.id));
  const orders = new Set(courses.map((course) => course.metadata.order));
  if (ids.size !== courses.length || orders.size !== courses.length)
    throw new Error("duplicate course id or order");
  catalogCache = courses;
  return catalogCache;
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCatalog().find((item) => item.metadata.slug === courseSlug);
  const lesson = course?.lessons.find((item) => item.metadata.slug === lessonSlug);
  return course && lesson ? { course, lesson } : null;
}
