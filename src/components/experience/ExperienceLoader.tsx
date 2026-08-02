"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/config/portfolio";
import { useExperienceStore } from "@/store/experience";

type Props = { onRetry: () => void };

export function ExperienceLoader({ onRetry }: Props) {
  const { progress, errors } = useProgress();
  const [criticalReady, setCriticalReady] = useState(false);
  const [displayed, setDisplayed] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const started = useExperienceStore((state) => state.started);
  const setStarted = useExperienceStore((state) => state.setStarted);
  const setAssetsReady = useExperienceStore((state) => state.setAssetsReady);
  const setStaticMode = useExperienceStore((state) => state.setStaticMode);

  useEffect(() => {
    let live = true;
    const loadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = image.onerror = () => resolve();
        image.src = src;
      });
    Promise.all([
      ...projects.map((project) => loadImage(project.image)),
      document.fonts?.ready ?? Promise.resolve(),
    ]).then(() => live && setCriticalReady(true));
    return () => {
      live = false;
    };
  }, []);

  const measured = useMemo(
    () => Math.min(100, progress * 0.86 + (criticalReady ? 14 : 0)),
    [criticalReady, progress],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDisplayed((value) => Math.min(measured, value + Math.max(0.25, (measured - value) * 0.12)));
    }, 32);
    return () => window.clearInterval(timer);
  }, [measured]);

  const ready = measured >= 99.9;
  useEffect(() => setAssetsReady(ready), [ready, setAssetsReady]);

  const enter = (skip = false) => {
    if (!ready) return;
    setLeaving(true);
    const returning = localStorage.getItem("fariz-portfolio-visited") === "1";
    localStorage.setItem("fariz-portfolio-visited", "1");
    window.setTimeout(() => setStarted(true), skip ? 80 : returning ? 220 : 620);
  };

  if (started) return null;

  return (
    <div className={`loader ${leaving ? "loader--leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Loading portfolio">
      <div className="loader__mark" aria-hidden="true">FW / 26</div>
      <div className="loader__content">
        <p className="eyebrow">Tokyo after dark</p>
        <p className="loader__number" aria-live="polite">{Math.floor(displayed).toString().padStart(3, "0")}</p>
        <div className="loader__track"><span style={{ width: `${displayed}%` }} /></div>
        {errors.length > 0 ? (
          <div className="loader__actions">
            <p>The 3D city could not be loaded. The portfolio remains available.</p>
            <button onClick={onRetry}>Retry scene</button>
            <button onClick={() => { setStaticMode(true); setStarted(true); }}>Enter static version</button>
          </div>
        ) : ready ? (
          <div className="loader__actions">
            <button className="start-button" onClick={() => enter(false)}>Start experience <span>↗</span></button>
            <button className="text-button" onClick={() => enter(true)}>Skip intro</button>
          </div>
        ) : (
          <p className="loader__status">Loading city, imagery and type…</p>
        )}
      </div>
      <p className="loader__hint">No audio · scroll to travel</p>
    </div>
  );
}
