import { getCatalog } from "../src/lib/content/catalog";

try {
  const courses = getCatalog();
  const lessons = courses.reduce((total, course) => total + course.lessons.length, 0);
  console.log(`Validated ${courses.length} course(s), ${lessons} lesson(s).`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
