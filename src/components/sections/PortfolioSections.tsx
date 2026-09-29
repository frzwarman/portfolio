"use client";

import Image from "next/image";
import { contacts, experience, projects, skills } from "@/config/portfolio";
import { useExperienceStore } from "@/store/experience";
import { ProjectDetail } from "../experience/ProjectDetail";

const Arrow = () => <span aria-hidden="true">↗</span>;

export function IntroSection() {
  return (
    <section id="intro" className="story-section story-section--intro" data-section="intro">
      <div className="intro-copy reveal">
        <p className="eyebrow">Portfolio · Jakarta</p>
        <h1>Muhamad<br /><em>Fariz Warman</em></h1>
        <div className="intro-meta">
          <p>Front-end engineer at Pensieve.</p>
          <p>React, Next.js, TypeScript,<br />and the occasional Three.js city.</p>
        </div>
        <a className="cta" href="#projects">See projects <Arrow /></a>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="story-section story-section--about" data-section="about">
      <div className="panel panel--light reveal">
        <p className="eyebrow">01 · About / Education</p>
        <h2>I build the front end<br />of real systems.</h2>
        <p className="lede">Front-end engineer at Pensieve, before that sixteen months on retail tooling at K3MART. I came to software from International Relations through Purwadhika’s full-stack program, and I build with TypeScript, React, Next.js, and Tailwind CSS. What I care about: interfaces that stay clear under real data, and the details people feel without noticing.</p>
        <div className="education-grid">
          <article><span>Full-Stack Web Development</span><h3>Purwadhika Digital Technology School</h3><p>Intensive software development program</p></article>
          <article><span>Bachelor’s degree</span><h3>University of Al Azhar Indonesia</h3><p>International Relations</p></article>
        </div>
      </div>
    </section>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="story-section story-section--skills" data-section="skills">
      <div className="panel panel--hud reveal">
        <p className="eyebrow">02 · Systems / Toolkit</p>
        <h2>What I ship with.</h2>
        <ul className="skills-grid">
          {skills.map((skill, index) => <li key={skill}><span>{String(index + 1).padStart(2, "0")}</span>{skill}</li>)}
        </ul>
        <p className="panel-note">Currently focused on maintainable design systems, retail operations, and expressive browser experiences.</p>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  const setHighlightedProject = useExperienceStore((state) => state.setHighlightedProject);
  const selectedProject = useExperienceStore((state) => state.selectedProject);
  const staticMode = useExperienceStore((state) => state.staticMode);
  const openProject = useExperienceStore((state) => state.openProject);
  const closeProject = useExperienceStore((state) => state.closeProject);
  return (
    <section id="projects" className="story-section story-section--projects" data-section="projects">
      <div className="projects-heading reveal">
        <p className="eyebrow">03 · Selected work / {projects.length} stops</p>
        <h2>{projects.length} builds,<br />one city.</h2>
      </div>
      <div className="project-list">
        {projects.map((project, index) => (
          <article className={`project-card project-card--${project.accent} reveal`} key={project.name} onMouseEnter={() => setHighlightedProject(index)} onFocusCapture={() => setHighlightedProject(index)}>
            <div className="project-card__index">{String(index + 1).padStart(2, "0")}</div>
            <div className="project-card__image">
              <Image src={project.image} alt={`${project.name} interface preview`} width={960} height={540} sizes="(max-width: 720px) 90vw, 42vw" />
            </div>
            <div className="project-card__copy">
              <p>{project.type}</p><h3>{project.name}</h3><p>{project.description}</p>
              <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
              <button type="button" className="project-card__explore" onClick={() => openProject(index)} aria-label={`Explore ${project.name}`}>Explore landmark <Arrow /></button>
              <a href={project.href} target="_blank" rel="noreferrer" aria-label={project.name}>Visit project <Arrow /></a>
              {"repository" in project && <a href={project.repository} target="_blank" rel="noreferrer" aria-label={`View ${project.name} repository`}>View repository <Arrow /></a>}
            </div>
          </article>
        ))}
      </div>
      {staticMode && selectedProject !== null && <ProjectDetail projectIndex={selectedProject} onClose={closeProject} />}
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="story-section story-section--experience" data-section="experience">
      <div className="panel panel--timeline reveal">
        <p className="eyebrow">04 · Experience / Northbound</p>
        <h2>Where I’ve worked.</h2>
        <ol className="timeline">
          {experience.map((item, index) => (
            <li key={item.company}><span className="timeline__dot" /><p>{item.period}</p><div><span>{item.company}</span><h3>{item.role}</h3><p>{item.place}</p></div><b>{String(experience.length - index).padStart(2, "0")}</b></li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="story-section story-section--contact" data-section="contact">
      <div className="contact-panel reveal">
        <p className="eyebrow">05 · Last stop / Contact</p>
        <h2>Open to front-end roles<br /><em>and product work.</em></h2>
        <p>Email is the fastest way to reach me.</p>
        <div className="contact-links">
          {contacts.map((contact, index) => (
            <a key={contact.label} href={contact.href} aria-label={contact.label} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <span>{String(index + 1).padStart(2, "0")}</span>{contact.value}<Arrow />
            </a>
          ))}
        </div>
        <footer><p>© {new Date().getFullYear()} Muhamad Fariz Warman</p><p>3D model: Littlest Tokyo by Glen Fox · <a href="https://threejs.org/examples/#webgl_animation_keyframes" target="_blank" rel="noreferrer">Three.js example</a></p></footer>
      </div>
    </section>
  );
}

export default function PortfolioSections() {
  return <main id="static-content" className="semantic-portfolio"><IntroSection /><AboutSection /><SkillsSection /><ProjectsSection /><ExperienceSection /><ContactSection /></main>;
}
