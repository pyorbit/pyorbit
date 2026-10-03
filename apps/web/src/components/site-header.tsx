import Link from "next/link";
import { Container } from "@pyorbit/ui";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="header-inner">
        <Link className="wordmark" href="/" aria-label="PyOrbit home">
          <span className="brand-symbol" aria-hidden="true">{`{ }`}</span> PyOrbit
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          <Link href="/courses">Courses</Link>
          <a href="https://github.com/pyorbit/pyorbit">Contribute</a>
          <Link href="/preview">Practice preview</Link>
        </nav>
      </Container>
    </header>
  );
}
