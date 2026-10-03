import Link from "next/link";
import { Container, EmptyState } from "@pyorbit/ui";
import { SiteHeader } from "@/components/site-header";
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <Container>
          <EmptyState
            title="Page not found"
            description="The page may have moved, or the lesson is not in the catalog."
          />
          <Link className="text-link" href="/courses">
            Browse courses
          </Link>
        </Container>
      </main>
    </>
  );
}
