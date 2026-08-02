import { create } from "zustand";
import type { QualityTier } from "@/config/quality";
import type { SectionId } from "@/config/portfolio";

type ExperienceState = {
  interactionPhase: "overview" | "travelling" | "exploring" | "detail-open";
  activeSection: SectionId;
  scrollProgress: number;
  highlightedProject: number;
  selectedProject: number | null;
  panelExpanded: boolean;
  started: boolean;
  assetsReady: boolean;
  reducedMotion: boolean;
  staticMode: boolean;
  quality: QualityTier;
  setActiveSection: (section: SectionId) => void;
  navigateTo: (section: SectionId) => void;
  openProject: (index: number) => void;
  closeProject: () => void;
  togglePanel: () => void;
  setPanelExpanded: (expanded: boolean) => void;
  setInteractionPhase: (phase: ExperienceState["interactionPhase"]) => void;
  setScrollProgress: (progress: number) => void;
  setHighlightedProject: (index: number) => void;
  setStarted: (started: boolean) => void;
  setAssetsReady: (ready: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setStaticMode: (enabled: boolean) => void;
  setQuality: (quality: QualityTier) => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  interactionPhase: "overview",
  activeSection: "intro",
  scrollProgress: 0,
  highlightedProject: 0,
  selectedProject: null,
  panelExpanded: true,
  started: false,
  assetsReady: false,
  reducedMotion: false,
  staticMode: false,
  quality: "medium",
  setActiveSection: (activeSection) => set({ activeSection }),
  navigateTo: (activeSection) =>
    set({
      activeSection,
      selectedProject: null,
      panelExpanded: true,
      interactionPhase: activeSection === "intro" ? "overview" : "travelling",
    }),
  openProject: (selectedProject) =>
    set({
      activeSection: "projects",
      highlightedProject: selectedProject,
      selectedProject,
      panelExpanded: true,
      interactionPhase: "travelling",
    }),
  closeProject: () => set({ selectedProject: null, panelExpanded: true, interactionPhase: "exploring" }),
  togglePanel: () => set((state) => ({ panelExpanded: !state.panelExpanded })),
  setPanelExpanded: (panelExpanded) => set({ panelExpanded }),
  setInteractionPhase: (interactionPhase) => set({ interactionPhase }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setHighlightedProject: (highlightedProject) => set({ highlightedProject }),
  setStarted: (started) => set({ started }),
  setAssetsReady: (assetsReady) => set({ assetsReady }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setStaticMode: (staticMode) => set({ staticMode }),
  setQuality: (quality) => set({ quality }),
}));
