import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Card, Container, EmptyState } from "@pyorbit/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCatalog } from "@/lib/content/catalog";

export const metadata: Metadata = { title: "Courses", alternates: { canonical: "/courses" } };
export default function CoursesPage() {
  const courses = getCatalog();
  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <Container>
          <p className="kicker">COURSE CATALOG</p>
          <h1>Learn at your pace.</h1>
          <p className="page-intro">
            A growing collection of free Python courses. The first course is a small foundation
            sample.
          </p>
          {courses.length ? (
            <div className="course-grid">
              {courses.map(({ metadata, lessons }) => (
                <Card className="course-card" key={metadata.id}>
                  <Badge>{metadata.difficulty}</Badge>
                  <h2>{metadata.title}</h2>
                  <p>{metadata.description}</p>
                  <div className="course-card-footer">
                    <span>{lessons.length} lessons</span>
                    <Link href={`/courses/${metadata.slug}/${lessons[0].metadata.slug}`}>
                      Explore <ArrowRight size={16} />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No courses yet"
              description="Course content will appear here when it is added to the repository."
            />
          )}
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
