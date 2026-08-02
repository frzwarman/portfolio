"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { getDestinationCamera, getOrbitDistanceBounds, getViewportKind } from "@/config/camera-scenes";
import { useExperienceStore } from "@/store/experience";

export function CameraRig() {
  const { camera, size } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const moving = useRef(true);
  const activeSection = useExperienceStore((state) => state.activeSection);
  const selectedProject = useExperienceStore((state) => state.selectedProject);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const phase = useExperienceStore((state) => state.interactionPhase);
  const setPhase = useExperienceStore((state) => state.setInteractionPhase);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const viewport = getViewportKind(size.width);
  const destination = getDestinationCamera(activeSection, selectedProject, viewport);
  const distanceBounds = getOrbitDistanceBounds(destination);

  useEffect(() => {
    moving.current = true;
  }, [activeSection, selectedProject, size.width]);

  useFrame((_, delta) => {
    desiredPosition.fromArray(destination.position);
    desiredTarget.fromArray(destination.target);

    if (moving.current || phase === "travelling") {
      const damping = reducedMotion ? 18 : 3.6;
      camera.position.lerp(desiredPosition, 1 - Math.exp(-damping * delta));
      target.lerp(desiredTarget, 1 - Math.exp(-damping * delta));
      controls.current?.target.copy(target);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.damp(camera.fov, destination.fov, damping, delta);
        camera.updateProjectionMatrix();
      }
      camera.lookAt(target);
      controls.current?.update();

      if (
        camera.position.distanceTo(desiredPosition) < 0.025 &&
        target.distanceTo(desiredTarget) < 0.025
      ) {
        moving.current = false;
        if (activeSection !== "intro") {
          setPhase(selectedProject === null ? "exploring" : "detail-open");
        }
      }
    }
  });

  const canExplore = (phase === "overview" || phase === "exploring") && !reducedMotion;

  return (
    <OrbitControls
      ref={controls}
      enabled={canExplore}
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.42}
      zoomSpeed={0.55}
      minDistance={distanceBounds.minDistance}
      maxDistance={distanceBounds.maxDistance}
      minPolarAngle={Math.PI * 0.2}
      maxPolarAngle={Math.PI * 0.48}
    />
  );
}
