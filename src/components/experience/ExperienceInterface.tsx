"use client";

import { useEffect, useRef } from "react";
import { contacts, experience, projects, skills } from "@/config/portfolio";
import { useExperienceStore } from "@/store/experience";
import { ProjectDetail } from "./ProjectDetail";

export function ExperienceInterface() {
  const active = useExperienceStore((state) => state.activeSection);
  const phase = useExperienceStore((state) => state.interactionPhase);
  const selectedProject = useExperienceStore((state) => state.selectedProject);
  const openProject = useExperienceStore((state) => state.openProject);
  const closeProject = useExperienceStore((state) => state.closeProject);
  const panelExpanded = useExperienceStore((state) => state.panelExpanded);
  const setPanelExpanded = useExperienceStore((state) => state.setPanelExpanded);
  const returnProject = useRef<number | null>(null);
  const restoreControl = useRef<HTMLButtonElement>(null);
  const wasExpanded = useRef(panelExpanded);

  useEffect(() => {
    if (selectedProject !== null) {
      returnProject.current = selectedProject;
      return;
    }
    const projectIndex = returnProject.current;
    returnProject.current = null;
    if (projectIndex === null || active !== "projects") return;

    history.replaceState(null, "", "#projects");
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-project-index="${projectIndex}"]`)?.focus();
    });
  }, [active, selectedProject]);

  useEffect(() => {
    if (!panelExpanded) {
      requestAnimationFrame(() => restoreControl.current?.focus());
    } else if (!wasExpanded.current) {
      requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(".panel-minimize")?.focus());
    }
    wasExpanded.current = panelExpanded;
  }, [panelExpanded]);

  const open = (index: number) => {
    openProject(index);
    history.pushState(null, "", `#project-${index + 1}`);
  };

  const close = () => {
    closeProject();
  };

  const sectionLabels = {
    about: "About and education",
    skills: "Skills lab",
    projects: "Project district",
    experience: "Experience line",
    contact: "Contact overlook",
  } as const;
  const panelLabel = selectedProject !== null
    ? `${projects[selectedProject]?.name ?? "Project"} information`
    : active === "intro" ? "City overview" : `${sectionLabels[active]} information`;
  const minimize = () => setPanelExpanded(false);

  return (
    <main id="main-content" className="experience-interface">
      <div className="explore-status" aria-live="polite">
        <span className={phase === "travelling" ? "status-dot status-dot--moving" : "status-dot"} />
        {phase === "travelling" ? "Travelling to landmark" : active === "intro" ? "City overview" : "Drag to look · scroll to zoom"}
      </div>

      {active === "intro" && (
        <section className="overview-copy" aria-labelledby="overview-title">
          <p className="eyebrow">Interactive portfolio · Jakarta / 2026</p>
          <h1 id="overview-title">Muhamad<br /><em>Fariz Warman</em></h1>
          <p>Front-End Developer</p>
          <p className="overview-copy__hint">Choose a city landmark or open the menu to begin.</p>
        </section>
      )}

      {panelExpanded && active === "about" && selectedProject === null && (
        <section className="district-panel district-panel--light" aria-labelledby="about-title">
          <button className="panel-minimize" type="button" onClick={minimize} aria-label="Minimize About and education information"><span aria-hidden="true">—</span> Minimize</button>
          <p className="eyebrow">01 · About / Education</p>
          <h2 id="about-title">Design sense.<br />Systems thinking.</h2>
          <p>I’m a front-end developer with an International Relations background and full-stack training from Purwadhika. I build and modernize user-focused products with TypeScript, React, Next.js, and Tailwind CSS.</p>
          <div className="district-panel__rows"><p><span>Purwadhika</span>Full-Stack Web Development</p><p><span>University of Al Azhar Indonesia</span>International Relations</p></div>
        </section>
      )}

      {panelExpanded && active === "skills" && selectedProject === null && (
        <section className="district-panel" aria-labelledby="skills-title">
          <button className="panel-minimize" type="button" onClick={minimize} aria-label="Minimize Skills lab information"><span aria-hidden="true">—</span> Minimize</button>
          <p className="eyebrow">02 · Skills lab</p>
          <h2 id="skills-title">Tools that turn<br />intent into interface.</h2>
          <ul className="district-skills">{skills.map((skill, index) => <li key={skill}><span>{String(index + 1).padStart(2, "0")}</span>{skill}</li>)}</ul>
        </section>
      )}

      {panelExpanded && active === "projects" && selectedProject === null && (
        <section className="district-panel district-panel--projects" aria-labelledby="projects-title">
          <button className="panel-minimize" type="button" onClick={minimize} aria-label="Minimize Project district information"><span aria-hidden="true">—</span> Minimize</button>
          <p className="eyebrow">03 · Project district</p>
          <div className="district-projects">{projects.map((project, index) => <button type="button" data-project-index={index} key={project.name} onClick={() => open(index)}><span>{String(index + 1).padStart(2, "0")}</span>{project.name}<i aria-hidden="true">↗</i></button>)}</div>
        </section>
      )}

      {panelExpanded && active === "experience" && selectedProject === null && (
        <section className="district-panel" aria-labelledby="experience-title">
          <button className="panel-minimize" type="button" onClick={minimize} aria-label="Minimize Experience line information"><span aria-hidden="true">—</span> Minimize</button>
          <p className="eyebrow">04 · Experience line</p>
          <h2 id="experience-title">Building forward.</h2>
          <ol className="district-timeline">{experience.map((item) => <li key={item.company}><p>{item.period}</p><div><span>{item.company}</span><h3>{item.role}</h3><p>{item.place}</p></div></li>)}</ol>
        </section>
      )}

      {panelExpanded && active === "contact" && selectedProject === null && (
        <section className="district-panel district-panel--contact" aria-labelledby="contact-title">
          <button className="panel-minimize" type="button" onClick={minimize} aria-label="Minimize Contact overlook information"><span aria-hidden="true">—</span> Minimize</button>
          <p className="eyebrow">05 · Contact overlook</p>
          <h2 id="contact-title">Let’s build something<br />clear and memorable.</h2>
          <div className="district-contacts">{contacts.map((contact) => <a key={contact.label} href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={contact.label}>{contact.value}<span aria-hidden="true">↗</span></a>)}</div>
        </section>
      )}

      {panelExpanded && selectedProject !== null && <ProjectDetail projectIndex={selectedProject} onClose={close} onMinimize={minimize} />}
      {!panelExpanded && active !== "intro" && (
        <button
          ref={restoreControl}
          className="panel-restore"
          type="button"
          aria-label={`Expand ${panelLabel}`}
          onClick={() => setPanelExpanded(true)}
        >
          <span>{selectedProject !== null ? projects[selectedProject]?.name : sectionLabels[active]}</span>
          <strong>Expand information</strong>
        </button>
      )}
    </main>
  );
}
