"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { projects } from "@/config/portfolio";

type ProjectDetailProps = {
  projectIndex: number;
  onClose: () => void;
};

export function ProjectDetail({ projectIndex, onClose }: ProjectDetailProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const project = projects[projectIndex];

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialog.current) return;

      const focusable = Array.from(
        dialog.current.querySelectorAll<HTMLElement>("button, a[href]"),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => {
      window.removeEventListener("keydown", handleKeys);
      previousFocus.current?.focus();
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div ref={dialog} className="landmark-detail" role="dialog" aria-modal="true" aria-labelledby={`project-detail-${projectIndex}`}>
      <div className="landmark-detail__beam" aria-hidden="true" />
      <button ref={closeButton} className="landmark-detail__close" type="button" onClick={onClose} aria-label={`Close ${project.name}`}>×</button>
      <p className="eyebrow">Project landmark · {String(projectIndex + 1).padStart(2, "0")}</p>
      <div className="landmark-detail__image">
        <Image src={project.image} alt={`${project.name} interface preview`} width={960} height={540} sizes="(max-width: 700px) 92vw, 420px" />
      </div>
      <p className="landmark-detail__type">{project.type}</p>
      <h2 id={`project-detail-${projectIndex}`}>{project.name}</h2>
      <p>{project.description}</p>
      <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
      <div className="landmark-detail__actions">
        <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name}`}>Visit project <span aria-hidden="true">↗</span></a>
        {"repository" in project && (
          <a href={project.repository} target="_blank" rel="noreferrer" aria-label={`View ${project.name} repository`}>View repository <span aria-hidden="true">↗</span></a>
        )}
      </div>
    </div>
  );
}
