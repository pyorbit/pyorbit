import { z } from "zod";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase letters, numbers, and hyphens");
export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export const courseSchema = z.strictObject({
  id: slug,
  slug,
  title: z.string().min(3),
  description: z.string().min(10),
  order: z.number().int().nonnegative(),
  difficulty: difficultySchema,
  tags: z.array(slug).default([]),
});
export const lessonSchema = z.strictObject({
  id: slug,
  slug,
  title: z.string().min(3),
  description: z.string().min(10),
  order: z.number().int().positive(),
  difficulty: difficultySchema,
  estimatedTime: z.number().int().positive(),
  prerequisites: z.array(slug).default([]),
  tags: z.array(slug).default([]),
});
export type Course = z.infer<typeof courseSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
