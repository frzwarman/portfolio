"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { sectionIds, type SectionId } from "@/config/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useExperienceStore } from "@/store/experience";

export function ScrollDirector() {
  const started = useExperienceStore((state) => state.started);
  const setActive = useExperienceStore((state) => state.setActiveSection);
  const setProgress = useExperienceStore((state) => state.setScrollProgress);
  const setReduced = useExperienceStore((state) => state.setReducedMotion);
  const reduced = useExperienceStore((state) => state.reducedMotion);
  const preferredReduced = useReducedMotion();

  useEffect(() => setReduced(preferredReduced), [preferredReduced, setReduced]);

  useEffect(() => {
    document.documentElement.classList.toggle("experience-locked", !started);
    return () => document.documentElement.classList.remove("experience-locked");
  }, [started]);

  useEffect(() => {
    if (!started) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = reduced ? null : new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.05 });
    const update = (time: number) => lenis?.raf(time * 1000);
    if (lenis) gsap.ticker.add(update);

    const triggers = sectionIds.map((section) => {
      const element = document.getElementById(section);
      if (!element) return null;
      return ScrollTrigger.create({
        trigger: element,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: ({ isActive }) => {
          if (!isActive) return;
          setActive(section);
          if (window.location.hash !== `#${section}`) history.replaceState(null, "", `#${section}`);
        },
        onUpdate: ({ progress }) => setProgress(progress),
      });
    });

    const revealContext = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((element) => {
        if (reduced) return gsap.set(element, { opacity: 1, y: 0 });
        gsap.fromTo(element, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 82%", once: false } });
      });
    });

    const restoreHash = () => {
      const id = window.location.hash.slice(1) as SectionId;
      if (sectionIds.includes(id)) document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    };
    window.addEventListener("popstate", restoreHash);
    window.setTimeout(() => { restoreHash(); ScrollTrigger.refresh(); }, 80);

    return () => {
      window.removeEventListener("popstate", restoreHash);
      triggers.forEach((trigger) => trigger?.kill());
      revealContext.revert();
      if (lenis) { gsap.ticker.remove(update); lenis.destroy(); }
    };
  }, [reduced, setActive, setProgress, started]);

  return null;
}
