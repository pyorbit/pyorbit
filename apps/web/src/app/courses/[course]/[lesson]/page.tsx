import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge, Container } from "@pyorbit/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LessonMarkdown } from "@/features/lessons/markdown";
import { getCatalog, getLesson } from "@/lib/content/catalog";

type Params = Promise<{ course: string; lesson: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return getCatalog().flatMap((course) =>
    course.lessons.map((lesson) => ({
      course: course.metadata.slug,
      lesson: lesson.metadata.slug,
    })),
  );
}
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course, lesson } = await params;
  const entry = getLesson(course, lesson);
  if (!entry) return {};
  return {
    title: entry.lesson.metadata.title,
    description: entry.lesson.metadata.description,
    alternates: { canonical: `/courses/${course}/${lesson}` },
    openGraph: {
      title: entry.lesson.metadata.title,
      description: entry.lesson.metadata.description,
    },
  };
}
export default async function LessonPage({ params }: { params: Params }) {
  const { course, lesson } = await params;
  const entry = getLesson(course, lesson);
  if (!entry) notFound();
  const index = entry.course.lessons.findIndex((item) => item.metadata.slug === lesson);
  const previous = entry.course.lessons[index - 1];
  const next = entry.course.lessons[index + 1];
  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <Container className="lesson-layout-new">
          <aside className="lesson-sidebar">
            <Link className="back-link" href="/courses">
              <ArrowLeft size={16} /> All courses
            </Link>
            <h2>{entry.course.metadata.title}</h2>
            <nav aria-label="Course lessons">
              <ol>
                {entry.course.lessons.map((item) => (
                  <li key={item.metadata.id}>
                    <Link
                      aria-current={item.metadata.slug === lesson ? "page" : undefined}
                      href={`/courses/${course}/${item.metadata.slug}`}
                    >
                      <span>{String(item.metadata.order).padStart(2, "0")}</span>
                      {item.metadata.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <article className="lesson-article">
            <div className="lesson-meta">
              <Badge>{entry.lesson.metadata.difficulty}</Badge>
              <span>{entry.lesson.metadata.estimatedTime} min read</span>
            </div>
            <p className="lesson-description">{entry.lesson.metadata.description}</p>
            <LessonMarkdown source={entry.lesson.body} />
            <nav className="lesson-pagination" aria-label="Lesson navigation">
              {previous ? (
                <Link href={`/courses/${course}/${previous.metadata.slug}`}>
                  <ArrowLeft size={16} /> {previous.metadata.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/courses/${course}/${next.metadata.slug}`}>
                  {next.metadata.title} <ArrowRight size={16} />
                </Link>
              ) : (
                <Link href="/courses">
                  Back to courses <ArrowRight size={16} />
                </Link>
              )}
            </nav>
          </article>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
