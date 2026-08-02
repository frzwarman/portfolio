"use client";

import { useState } from "react";
import { useExperienceStore } from "@/store/experience";

const links = [
  { label: "Overview", href: "#intro" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const active = useExperienceStore((state) => state.activeSection);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const setReducedMotion = useExperienceStore((state) => state.setReducedMotion);
  const navigateTo = useExperienceStore((state) => state.navigateTo);
  const staticMode = useExperienceStore((state) => state.staticMode);

  const navigate = (href: string) => {
    const section = href.slice(1) as typeof active;
    navigateTo(section);
    history.pushState(null, "", href);
    if (staticMode) document.querySelector(href)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
    setOpen(false);
  };

  return (
    <header className="site-header">
      <a className="brand" href="#intro" onClick={(event) => { event.preventDefault(); navigate("#intro"); }} aria-label="Muhamad Fariz Warman — Home">
        <span>FW</span><small>Explore / 26</small>
      </a>
      <p className="section-indicator"><span>{String(links.findIndex((item) => item.href === `#${active}`) + 1).padStart(2, "0")}</span> / {String(links.length).padStart(2, "0")} · {active}</p>
      <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span /> <span />
      </button>
      <nav className={open ? "site-nav site-nav--open" : "site-nav"} aria-label="Primary navigation">
        {links.map((link, index) => (
          <a key={link.href} href={link.href} aria-current={active === link.href.slice(1) ? "page" : undefined} onClick={(event) => { event.preventDefault(); navigate(link.href); }}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{link.label}
          </a>
        ))}
        <p className="nav-instructions">Select a district to fly there. After arrival, drag to look around and scroll to zoom.</p>
        <label className="motion-toggle"><span>Motion</span><input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} /> Reduce</label>
      </nav>
    </header>
  );
}
