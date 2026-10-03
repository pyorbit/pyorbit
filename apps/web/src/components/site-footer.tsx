import { Container } from "@pyorbit/ui";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="footer-inner">
        <span>PyOrbit · Open source Python learning</span>
        <a href="https://github.com/pyorbit/pyorbit">GitHub</a>
      </Container>
    </footer>
  );
}
