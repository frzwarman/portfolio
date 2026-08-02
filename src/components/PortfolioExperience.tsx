"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CanvasBoundary } from "./experience/CanvasBoundary";
import { ExperienceLoader } from "./experience/ExperienceLoader";
import { ExperienceInterface } from "./experience/ExperienceInterface";
import { NavigationDirector } from "./experience/NavigationDirector";
import { StaticBackdrop } from "./experience/StaticBackdrop";
import Navigation from "./navigation/Navigation";
import PortfolioSections from "./sections/PortfolioSections";
import { getQualityTier, supportsWebGL } from "@/config/quality";
import { useExperienceStore } from "@/store/experience";

const ExperienceCanvas = dynamic(() => import("./experience/ExperienceCanvas"), { ssr: false });

export default function PortfolioExperience() {
  const [checked, setChecked] = useState(false);
  const started = useExperienceStore((state) => state.started);
  const staticMode = useExperienceStore((state) => state.staticMode);
  const setStarted = useExperienceStore((state) => state.setStarted);
  const setStaticMode = useExperienceStore((state) => state.setStaticMode);
  const setQuality = useExperienceStore((state) => state.setQuality);

  useEffect(() => {
    setQuality(getQualityTier());
    if (!supportsWebGL()) setStaticMode(true);
    setChecked(true);
  }, [setQuality, setStaticMode]);

  const useStatic = checked && staticMode;

  return (
    <div className={`${started ? "portfolio portfolio--started" : "portfolio"}${useStatic ? " portfolio--static" : ""}`}>
      <a className="skip-link" href={useStatic ? "#static-content" : "#main-content"}>Skip to content</a>
      {useStatic ? (
        <StaticBackdrop />
      ) : (
        <CanvasBoundary fallback={<StaticBackdrop />}>
          <ExperienceCanvas />
        </CanvasBoundary>
      )}
      <div className="atmosphere" aria-hidden="true" />
      <Navigation />
      {!useStatic && <ExperienceInterface />}
      <PortfolioSections />
      <NavigationDirector />
      {!useStatic && <ExperienceLoader onRetry={() => window.location.reload()} />}
      {useStatic && !started && (
        <div className="loader" role="dialog" aria-modal="true" aria-label="Static portfolio">
          <div className="loader__content"><p className="eyebrow">Accessible city route</p><p className="loader__number">HTML</p><p>Your browser is using the lightweight, fully navigable edition.</p><div className="loader__actions"><button className="start-button" onClick={() => setStarted(true)}>Enter portfolio <span>↗</span></button></div></div>
        </div>
      )}
    </div>
  );
}
