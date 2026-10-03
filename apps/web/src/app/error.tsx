"use client";
import { EmptyState } from "@pyorbit/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="page-main container">
      <EmptyState title="Something went wrong" description="Please try loading this page again." />
      <button className="button button--primary" onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
