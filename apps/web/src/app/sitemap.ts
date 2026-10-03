import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/content/catalog";
const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: origin },
    { url: `${origin}/courses` },
    ...getCatalog().flatMap((course) =>
      course.lessons.map((lesson) => ({
        url: `${origin}/courses/${course.metadata.slug}/${lesson.metadata.slug}`,
      })),
    ),
  ];
}
