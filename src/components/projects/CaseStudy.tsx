import Image from "next/image";
import Link from "next/link";
import type { ProjectCaseStudy, ProjectSummary } from "@/config/project-types";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

const sections = [
  ["overview", "Overview"],
  ["problem", "The problem"],
  ["constraints", "Constraints"],
  ["architecture", "Architecture"],
  ["hard-problem", "Hard engineering problem"],
  ["decisions", "Engineering decisions"],
  ["failure-states", "Failure states"],
  ["performance", "Performance"],
  ["result", "Result"],
] as const;

type CaseStudyProps = {
  project: ProjectSummary;
  study: ProjectCaseStudy;
};

/** A server-rendered reading layer of the city, independent of its WebGL scene. */
export function CaseStudy({ project, study }: CaseStudyProps) {
  return (
    <div className={`case-study case-study--${project.accent}`}>
      <a className="skip-link" href="#case-content">Skip to case study</a>
      <header className="case-header">
        <Link className="brand" href="/#intro" prefetch={false} aria-label="Muhamad Fariz Warman, home">
          <span>FW</span><small>Portfolio</small>
        </Link>
        <nav aria-label="Project navigation">
          <Link href={`/#${project.landmarkId}`} prefetch={false}>Back to landmark</Link>
          <Link href="/#projects" prefetch={false}>All projects</Link>
        </nav>
      </header>

      <main id="case-content" tabIndex={-1}>
        <section className="case-hero" aria-labelledby="case-title">
          <p className="case-location">Jakarta / Project district / {project.name}</p>
          <p className="case-concept">{project.concept}</p>
          <h1 id="case-title">{project.name}</h1>
          <p className="case-positioning">{study.positioning}</p>
          <div className="case-hero__links">
            <a href={project.href} target="_blank" rel="noreferrer">
              Visit {project.name}<span className="sr-only"> (opens in a new tab)</span>
              <span aria-hidden="true">↗</span>
            </a>
            {project.repository && (
              <a href={project.repository} target="_blank" rel="noreferrer">
                View source<span className="sr-only"> (opens in a new tab)</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </section>

        <div className="case-layout">
          <nav className="case-index" aria-label="Case study sections">
            {sections.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}
          </nav>
          <div className="case-content">
            <section id="overview" className="case-section" aria-labelledby="overview-heading">
              <h2 id="overview-heading">Overview</h2>
              <p className="case-lede">{study.overview}</p>
              <dl className="case-facts">
                <div><dt>Role</dt><dd>{study.role.join(", ")}</dd></div>
                <div><dt>Status</dt><dd>{study.status}</dd></div>
                <div><dt>Core stack</dt><dd>{project.stack.join(" · ")}</dd></div>
              </dl>
              <figure className="case-preview">
                <Image
                  src={project.image}
                  alt={`${project.name} application interface`}
                  width={960}
                  height={540}
                  sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1200px) 65vw, 760px"
                />
                <figcaption>{project.type}</figcaption>
              </figure>
            </section>

            <section id="problem" className="case-section" aria-labelledby="problem-heading">
              <h2 id="problem-heading">The problem</h2>
              <p className="case-lede">{study.problem}</p>
            </section>

            <section id="constraints" className="case-section" aria-labelledby="constraints-heading">
              <h2 id="constraints-heading">Constraints</h2>
              <dl className="case-constraints">
                {study.constraints.map((constraint) => (
                  <div key={constraint.title}>
                    <dt>{constraint.title}</dt><dd>{constraint.description}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section id="architecture" className="case-section" aria-labelledby="architecture-heading">
              <h2 id="architecture-heading">Architecture</h2>
              {study.architecture.map((flow) => <ArchitectureDiagram key={flow.title} flow={flow} />)}
            </section>

            <section id="hard-problem" className="case-section case-section--challenge" aria-labelledby="hard-problem-heading">
              <p className="case-section-label">Hard engineering problem</p>
              <h2 id="hard-problem-heading">{study.hardProblem.title}</h2>
              <p>{study.hardProblem.problem}</p>
              <p>{study.hardProblem.solution}</p>
              <ol className="case-sequence">
                {study.hardProblem.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </section>

            <section id="decisions" className="case-section" aria-labelledby="decisions-heading">
              <h2 id="decisions-heading">Engineering decisions</h2>
              <div className="case-decisions">
                {study.decisions.map((decision) => (
                  <article key={decision.decision}>
                    <h3>{decision.decision}</h3>
                    <dl>
                      <div><dt>Why</dt><dd>{decision.why}</dd></div>
                      <div><dt>Tradeoff</dt><dd>{decision.tradeoff}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <section id="failure-states" className="case-section" aria-labelledby="failures-heading">
              <h2 id="failures-heading">Failure states</h2>
              <p>What happens when the happy path breaks.</p>
              <div className="case-failures">
                {study.failureStates.map((failure) => (
                  <details key={failure.trigger}>
                    <summary>{failure.trigger}<span aria-hidden="true">+</span></summary>
                    <p>{failure.response}</p>
                  </details>
                ))}
              </div>
            </section>

            <section id="performance" className="case-section" aria-labelledby="performance-heading">
              <h2 id="performance-heading">Performance</h2>
              <ul className="case-strategies" role="list">
                {study.performance.map((item) => (
                  <li key={item.strategy}><h3>{item.strategy}</h3><p>{item.detail}</p></li>
                ))}
              </ul>
            </section>

            <section id="result" className="case-section" aria-labelledby="result-heading">
              <h2 id="result-heading">What this enables</h2>
              {study.results.map((result) => <p className="case-lede" key={result}>{result}</p>)}
              <div className="case-boundaries" role="note" aria-labelledby="boundaries-heading">
                <h3 id="boundaries-heading">Operating boundaries</h3><p>{study.limitations}</p>
              </div>
              {project.repository && study.sources.length > 0 && (
                <details className="case-sources">
                  <summary>Inspect the implementation</summary>
                  <ul>
                    {study.sources.map((source) => (
                      <li key={source.path}>
                        <a href={`${project.repository}/blob/HEAD/${source.path}`} target="_blank" rel="noreferrer">
                          {source.label}<span className="sr-only"> (opens in a new tab)</span>
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className="case-footer">
        <Link href={`/#${project.landmarkId}`} prefetch={false}>Return to {project.name} in the city</Link>
        <a href="#case-title">Back to top</a>
      </footer>
    </div>
  );
}
