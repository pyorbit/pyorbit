import Link from "next/link";
import { ArrowRight, BookOpen, Code2, GitPullRequest, Sparkles } from "lucide-react";
import { Badge, Card, Container } from "@pyorbit/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeBlock } from "@/features/lessons/code-block";
import { getCatalog } from "@/lib/content/catalog";

export default function Home() {
  const courses = getCatalog();
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <Container className="hero-inner">
            <div>
              <Badge>Learn by reading and trying</Badge>
              <h1>
                Learn Python.
                <br />
                <span>Understand it.</span>
                <br />
                Build with it.
              </h1>
              <p className="hero-copy">
                A clear path into Python, built in the open. Start with small lessons, read real
                code, and grow your skills one concept at a time.
              </p>
              <div className="hero-actions">
                <Link className="button button--primary" href="/courses">
                  Explore courses <ArrowRight size={18} />
                </Link>
                <a className="button button--secondary" href="https://github.com/pyorbit/pyorbit">
                  View on GitHub
                </a>
              </div>
            </div>
            <div className="hero-code" aria-label="Python example">
              <div className="terminal-heading">
                <span className="terminal-dots" aria-hidden="true">
                  ● ● ●
                </span>
                <span>first_steps.py</span>
              </div>
              <div className="terminal-code">
                <span className="code-purple">def</span> greet(name):
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-purple">return</span> f
                <span className="code-green">&quot;Hello, {`{name}`}!&quot;</span>
                <br />
                <br />
                print(greet(<span className="code-green">&quot;world&quot;</span>))
                <br />
                <span className="code-muted"># Hello, world!</span>
              </div>
            </div>
          </Container>
        </section>
        <section className="section">
          <Container>
            <div className="section-heading">
              <div>
                <p className="kicker">START HERE</p>
                <h2>A first course, built for clarity</h2>
              </div>
              <Link className="text-link" href="/courses">
                All courses <ArrowRight size={17} />
              </Link>
            </div>
            <div className="course-grid">
              {courses.map(({ metadata, lessons }) => (
                <Card key={metadata.id} className="course-card">
                  <div className="course-icon">
                    <BookOpen size={24} />
                  </div>
                  <Badge>{metadata.difficulty}</Badge>
                  <h3>{metadata.title}</h3>
                  <p>{metadata.description}</p>
                  <div className="course-card-footer">
                    <span>{lessons.length} lessons</span>
                    <Link
                      href={`/courses/${metadata.slug}/${lessons[0]?.metadata.slug ?? ""}`}
                      aria-label={`Start ${metadata.title}`}
                    >
                      Start learning <ArrowRight size={16} />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
        <section className="section section-tinted">
          <Container>
            <div className="section-heading">
              <div>
                <p className="kicker">THE APPROACH</p>
                <h2>Made for understanding</h2>
              </div>
            </div>
            <div className="value-grid">
              <div>
                <Code2 size={25} />
                <h3>Read real Python</h3>
                <p>
                  Examples stay close to the ideas they explain. Copy a snippet and explore it in
                  your own interpreter.
                </p>
              </div>
              <div>
                <Sparkles size={25} />
                <h3>Follow a path</h3>
                <p>
                  Lessons have clear prerequisites and short steps. A full curriculum is being
                  developed in public.
                </p>
              </div>
              <div>
                <GitPullRequest size={25} />
                <h3>Improve it together</h3>
                <p>
                  Lessons live in Git. Fix an explanation or propose a new one through a pull
                  request.
                </p>
              </div>
            </div>
          </Container>
        </section>
        <section className="section">
          <Container className="example-section">
            <div>
              <p className="kicker">A TASTE OF PYTHON</p>
              <h2>Small ideas. Useful code.</h2>
              <p>Each lesson pairs a concise explanation with code you can study and change.</p>
              <Link className="text-link" href="/courses/python-fundamentals/hello-python">
                Read the first lesson <ArrowRight size={17} />
              </Link>
            </div>
            <CodeBlock
              code={'name = "Ada"\nprint(f"Hello, {name}!")'}
              title="hello.py"
              highlightedLines={[2]}
              showLineNumbers
            />
          </Container>
        </section>
        <section className="contribute-section">
          <Container>
            <p className="kicker">OPEN SOURCE</p>
            <h2>Help shape how Python is taught.</h2>
            <p>
              PyOrbit is at an early stage. Contributions to lessons, accessibility, design, and the
              platform are welcome.
            </p>
            <a
              className="button button--secondary"
              href="https://github.com/pyorbit/pyorbit/blob/main/CONTRIBUTING.md"
            >
              Contribution guide <ArrowRight size={18} />
            </a>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
