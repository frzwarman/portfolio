import type { ArchitectureFlow } from "@/config/project-types";

/**
 * Native disclosures make stages explorable without a client bundle.
 * The ordered DOM describes the same flow to screen readers and on mobile.
 */
export function ArchitectureDiagram({ flow }: { flow: ArchitectureFlow }) {
  return (
    <figure className="architecture-flow">
      <figcaption>
        <h3>{flow.title}</h3>
        <p>{flow.description}</p>
      </figcaption>
      <p className="architecture-flow__hint">Open a stage to inspect its responsibility.</p>
      <ol className="architecture-flow__steps" role="list" aria-label={`${flow.title} flow`}>
        {flow.steps.map((step) => (
          <li key={step.label} className={step.branches ? "architecture-flow__step--branched" : undefined}>
            <details className="architecture-node">
              <summary>
                {step.label}<span aria-hidden="true">+</span>
              </summary>
              <p>{step.detail}</p>
            </details>
            {step.branches && (
              <ul className="architecture-branches" role="list" aria-label={`Paths from ${step.label}`}>
                {step.branches.map((branch) => (
                  <li key={branch.label} className={branch.continues ? "architecture-branch--continues" : undefined}>
                    <strong>{branch.label}</strong>
                    <p>{branch.detail}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
