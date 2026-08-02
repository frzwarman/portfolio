"use client";

import { useEffect } from "react";
import { landmarks } from "@/config/landmarks";
import { sectionIds, type SectionId } from "@/config/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useExperienceStore } from "@/store/experience";

export function NavigationDirector() {
  const started = useExperienceStore((state) => state.started);
  const staticMode = useExperienceStore((state) => state.staticMode);
  const setReduced = useExperienceStore((state) => state.setReducedMotion);
  const navigateTo = useExperienceStore((state) => state.navigateTo);
  const openProject = useExperienceStore((state) => state.openProject);
  const preferredReduced = useReducedMotion();

  useEffect(() => setReduced(preferredReduced), [preferredReduced, setReduced]);

  useEffect(() => {
    document.documentElement.classList.toggle("experience-locked", !started || !staticMode);
    return () => document.documentElement.classList.remove("experience-locked");
  }, [started, staticMode]);

  useEffect(() => {
    if (!started) return;
    const restore = () => {
      const hash = window.location.hash.slice(1);
      const projectNumber = /^project-(\d+)$/.exec(hash);
      const landmarkProject = landmarks.find((item) => item.id === hash)?.projectIndex;
      const index = projectNumber ? Number(projectNumber[1]) - 1 : landmarkProject;
      if (typeof index === "number" && index >= 0 && index < 5) {
        openProject(index);
        return;
      }
      if (sectionIds.includes(hash as SectionId)) {
        navigateTo(hash as SectionId);
        if (staticMode) document.getElementById(hash)?.scrollIntoView({ behavior: "auto" });
        return;
      }
      navigateTo("intro");
      history.replaceState(null, "", "#intro");
    };
    window.addEventListener("popstate", restore);
    restore();
    return () => window.removeEventListener("popstate", restore);
  }, [navigateTo, openProject, started, staticMode]);

  return null;
}
