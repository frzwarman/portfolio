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
  const assetsReady = useExperienceStore((state) => state.assetsReady);
  const staticMode = useExperienceStore((state) => state.staticMode);
  const setStarted = useExperienceStore((state) => state.setStarted);
  const setStaticMode = useExperienceStore((state) => state.setStaticMode);
  const setQuality = useExperienceStore((state) => state.setQuality);

  useEffect(() => {
    setQuality(getQualityTier());
    if (!supportsWebGL()) {
      setStaticMode(true);
      setStarted(true);
    }
    setChecked(true);
  }, [setQuality, setStaticMode, setStarted]);

  const useStatic = checked && staticMode;
  const className = [
    "portfolio",
    started && "portfolio--started",
    assetsReady && "portfolio--ready",
    useStatic && "portfolio--static",
  ].filter(Boolean).join(" ");

  return (
    <div className={className}>
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
    </div>
  );
}
