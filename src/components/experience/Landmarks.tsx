"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { landmarks, type Landmark } from "@/config/landmarks";
import { useExperienceStore } from "@/store/experience";

function LandmarkBeacon({ landmark }: { landmark: Landmark }) {
  const beacon = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const activeSection = useExperienceStore((state) => state.activeSection);
  const selectedProject = useExperienceStore((state) => state.selectedProject);
  const navigateTo = useExperienceStore((state) => state.navigateTo);
  const openProject = useExperienceStore((state) => state.openProject);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const active = landmark.projectIndex === undefined
    ? activeSection === landmark.section && selectedProject === null
    : selectedProject === landmark.projectIndex;

  useFrame((state) => {
    if (!beacon.current) return;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2.2 + landmark.position[0]) * 0.08;
    beacon.current.scale.setScalar((hovered || active ? 1.18 : 1) * pulse);
  });

  const activate = () => {
    if (landmark.projectIndex === undefined) {
      navigateTo(landmark.section);
      history.pushState(null, "", `#${landmark.section}`);
    } else {
      openProject(landmark.projectIndex);
      history.pushState(null, "", `#${landmark.id}`);
    }
  };

  return (
    <group position={landmark.position}>
      <group
        ref={beacon}
        onClick={(event) => { event.stopPropagation(); activate(); }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <mesh>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshBasicMaterial color={landmark.color} transparent opacity={active ? 0.95 : 0.65} />
        </mesh>
        <mesh>
          <sphereGeometry args={[landmark.hitRadius, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.19, 0.24, 32]} />
          <meshBasicMaterial color={landmark.color} transparent opacity={hovered || active ? 0.9 : 0.38} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color={landmark.color} intensity={hovered || active ? 2.4 : 1.1} distance={1.5} />
      </group>
      <Html center position={[0, 0.32, 0]} distanceFactor={7} style={{ pointerEvents: "auto" }}>
        <button
          type="button"
          className={active ? "landmark-label landmark-label--active" : "landmark-label"}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={activate}
        >
          {landmark.label}
        </button>
      </Html>
    </group>
  );
}

export function Landmarks() {
  const activeSection = useExperienceStore((state) => state.activeSection);
  const visibleLandmarks = landmarks.filter(
    (landmark) => landmark.projectIndex === undefined || activeSection === "projects",
  );

  return <>{visibleLandmarks.map((landmark) => <LandmarkBeacon key={landmark.id} landmark={landmark} />)}</>;
}
