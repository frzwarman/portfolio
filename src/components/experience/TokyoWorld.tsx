"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/store/experience";
import { Landmarks } from "./Landmarks";

const WORLD_ROTATION = -0.2;
const WORLD_Y = -0.9;

export function TokyoWorld() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(
    "/assets/models/LittlestTokyo.glb",
    "/assets/draco/",
  );
  const { actions, mixer } = useAnimations(animations, group);
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const root = useThree((state) => state.scene);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const highlightedProject = useExperienceStore(
    (state) => state.highlightedProject,
  );
  const setAssetsReady = useExperienceStore((state) => state.setAssetsReady);
  const [visible, setVisible] = useState(true);
  const [compiled, setCompiled] = useState(false);

  useEffect(() => {
    // Compile every material before the city is shown so the first visible frame never hitches.
    let live = true;
    gl.compileAsync(scene, camera, root)
      .catch(() => undefined)
      .finally(() => {
        if (!live) return;
        setCompiled(true);
        setAssetsReady(true);
      });
    return () => {
      live = false;
    };
  }, [gl, scene, camera, root, setAssetsReady]);

  useEffect(() => {
    if (!compiled) return;
    Object.values(actions).forEach((action) => action?.reset().fadeIn(0.8).play());
    return () => Object.values(actions).forEach((action) => action?.stop());
  }, [actions, compiled]);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useFrame((state, delta) => {
    mixer.timeScale = visible ? (reducedMotion ? 0.18 : 0.72) : 0;
    if (!group.current || reducedMotion || !visible) return;
    const glow = highlightedProject * 0.002;
    group.current.rotation.y = WORLD_ROTATION + Math.sin(state.clock.elapsedTime * 0.15) * 0.012 + glow;
    group.current.position.y = WORLD_Y + Math.sin(state.clock.elapsedTime * 0.35) * 0.018;
  });

  return (
    <group ref={group} dispose={null} position={[0, WORLD_Y, 0]} rotation={[0, WORLD_ROTATION, 0]}>
      {compiled && <primitive object={scene} scale={0.01} />}
      <Landmarks />
    </group>
  );
}

useGLTF.preload("/assets/models/LittlestTokyo.glb", "/assets/draco/");
