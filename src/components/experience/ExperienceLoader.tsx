"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useExperienceStore } from "@/store/experience";

type Props = { onRetry: () => void };

export function ExperienceLoader({ onRetry }: Props) {
  const { progress, errors } = useProgress();
  const [fontsReady, setFontsReady] = useState(false);
  const started = useExperienceStore((state) => state.started);
  const assetsReady = useExperienceStore((state) => state.assetsReady);
  const setStarted = useExperienceStore((state) => state.setStarted);
  const setStaticMode = useExperienceStore((state) => state.setStaticMode);

  useEffect(() => {
    let live = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => live && setFontsReady(true));
    return () => {
      live = false;
    };
  }, []);

  // The city download is most of the wait; shader compilation is the last stretch.
  const measured = Math.min(100, progress * 0.9 + (assetsReady && fontsReady ? 10 : 0));
  const ready = assetsReady && fontsReady && progress >= 100;

  const entering = useRef(false);
  useEffect(() => {
    // ponytail: ref guard, not a dep — a cleanup would cancel the timer on the next store change.
    if (!ready || entering.current || errors.length > 0) return;
    entering.current = true;
    window.setTimeout(() => setStarted(true), 400);
  }, [ready, errors.length, setStarted]);

  if (started) return null;

  return (
    <div className="loader" role="status" aria-live="polite">
      {errors.length > 0 ? (
        <div className="loader__actions">
          <p>The 3D city could not load. Everything else still works.</p>
          <button type="button" onClick={onRetry}>Retry scene</button>
          <button type="button" onClick={() => { setStaticMode(true); setStarted(true); }}>Use the static version</button>
        </div>
      ) : (
        <>
          <span className="loader__number">{String(Math.floor(measured)).padStart(3, "0")}</span>
          <span className="loader__track"><span style={{ width: `${measured}%` }} /></span>
          <span>{ready ? "Entering…" : "Loading city…"}</span>
        </>
      )}
    </div>
  );
}
