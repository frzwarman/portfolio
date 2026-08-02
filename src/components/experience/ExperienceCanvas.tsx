"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { qualityDpr } from "@/config/quality";
import { useExperienceStore } from "@/store/experience";
import { CameraRig } from "./CameraRig";
import { TokyoWorld } from "./TokyoWorld";

export default function ExperienceCanvas() {
  const quality = useExperienceStore((state) => state.quality);

  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        dpr={qualityDpr[quality]}
        camera={{ position: [5.4, 2.5, 7.5], fov: 34, near: 0.1, far: 100 }}
        gl={{
          antialias: quality !== "low",
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <fog attach="fog" args={["#07080d", 8, 24]} />
        <ambientLight intensity={1.6} color="#a6c8ff" />
        <hemisphereLight args={["#52e6ff", "#17051f", 2.2]} />
        <directionalLight
          position={[4, 7, 5]}
          intensity={3.2}
          color="#ffd7a8"
          castShadow={quality === "high"}
        />
        <pointLight position={[-3, 2, 2]} intensity={8} color="#ff3e9d" />
        <pointLight position={[3, 1, -2]} intensity={6} color="#35ddff" />
        <Suspense fallback={null}>
          <TokyoWorld />
        </Suspense>
        <CameraRig />
      </Canvas>
      <div className="canvas-vignette" />
    </div>
  );
}
