"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/store/experience";
import { Landmarks } from "./Landmarks";

export function TokyoWorld() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(
    "/assets/models/LittlestTokyo.glb",
    "/assets/draco/",
  );
  const { actions, mixer } = useAnimations(animations, group);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const quality = useExperienceStore((state) => state.quality);
  const highlightedProject = useExperienceStore(
    (state) => state.highlightedProject,
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    Object.values(actions).forEach((action) => action?.reset().fadeIn(0.8).play());
    return () => Object.values(actions).forEach((action) => action?.stop());
  }, [actions]);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = quality === "high";
        child.receiveShadow = quality !== "low";
      }
    });
  }, [quality, scene]);

  useFrame((state, delta) => {
    mixer.timeScale = visible ? (reducedMotion ? 0.18 : 0.72) : 0;
    if (!group.current || reducedMotion || !visible) return;
    const glow = highlightedProject * 0.002;
    group.current.rotation.y = -0.2 + Math.sin(state.clock.elapsedTime * 0.15) * 0.012 + glow;
    group.current.position.y = -0.9 + Math.sin(state.clock.elapsedTime * 0.35) * 0.018;
  });

  return (
    <group ref={group} dispose={null} position={[0, -0.9, 0]}>
      <primitive object={scene} scale={0.01} />
      <Landmarks />
    </group>
  );
}

useGLTF.preload("/assets/models/LittlestTokyo.glb", "/assets/draco/");
