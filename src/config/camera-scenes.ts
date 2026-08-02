import type { SectionId } from "./portfolio";
import { landmarks } from "./landmarks";

export type ViewportKind = "desktop" | "tablet" | "mobile";
export type Vec3 = [number, number, number];
export type CameraScene = { position: Vec3; target: Vec3; focus: Vec3; fov: number };

type ViewDefinition = {
  focus: Vec3;
  positions: Record<ViewportKind, Vec3>;
  fov?: Partial<Record<ViewportKind, number>>;
};

const aspectByViewport: Record<ViewportKind, number> = {
  desktop: 16 / 9,
  tablet: 4 / 3,
  mobile: 9 / 16,
};

const desiredComposition: Record<ViewportKind, { x: number; y: number }> = {
  desktop: { x: -0.36, y: 0.03 },
  tablet: { x: -0.2, y: 0.08 },
  mobile: { x: 0, y: 0.34 },
};

const WORLD_ROTATION = -0.2;
const WORLD_Y = -0.9;

function toWorldFocus([x, y, z]: Vec3): Vec3 {
  const cosine = Math.cos(WORLD_ROTATION);
  const sine = Math.sin(WORLD_ROTATION);
  return [cosine * x + sine * z, y + WORLD_Y, -sine * x + cosine * z];
}

function sectionFocus(section: SectionId): Vec3 {
  const landmark = landmarks.find((item) => item.section === section && item.projectIndex === undefined);
  return landmark ? toWorldFocus(landmark.position) : [0, 0.15, 0];
}

function framedScene(definition: ViewDefinition, viewport: ViewportKind): CameraScene {
  const position = definition.positions[viewport];
  const focus = definition.focus;
  const fov = definition.fov?.[viewport] ?? (viewport === "mobile" ? 49 : viewport === "tablet" ? 43 : 36);
  const dx = focus[0] - position[0];
  const dy = focus[1] - position[1];
  const dz = focus[2] - position[2];
  const distance = Math.hypot(dx, dy, dz);
  const horizontalLength = Math.hypot(dx, dz) || 1;
  const right: Vec3 = [-dz / horizontalLength, 0, dx / horizontalLength];
  const halfHeight = Math.tan((fov * Math.PI) / 360) * distance;
  const composition = desiredComposition[viewport];
  const horizontalShift = -composition.x * halfHeight * aspectByViewport[viewport];
  const verticalShift = -composition.y * halfHeight;

  return {
    position,
    focus,
    target: [
      focus[0] + right[0] * horizontalShift,
      focus[1] + verticalShift,
      focus[2] + right[2] * horizontalShift,
    ],
    fov,
  };
}

const sectionViews: Record<SectionId, ViewDefinition> = {
  intro: {
    focus: [0, 0.15, 0],
    positions: { desktop: [5.4, 2.5, 7.5], tablet: [6.3, 3.1, 8.8], mobile: [7.5, 4.2, 11.2] },
    fov: { desktop: 34, tablet: 40, mobile: 47 },
  },
  about: {
    focus: sectionFocus("about"),
    positions: { desktop: [-5.2, -0.55, 4.15], tablet: [-6.1, -0.15, 5.15], mobile: [-7.2, 0.35, 6.65] },
  },
  skills: {
    focus: sectionFocus("skills"),
    positions: { desktop: [4.35, -0.55, 4.0], tablet: [5.3, -0.1, 5.1], mobile: [6.45, 0.4, 6.55] },
  },
  projects: {
    focus: sectionFocus("projects"),
    positions: { desktop: [-3.8, -1.05, 4.45], tablet: [-4.7, -0.55, 5.55], mobile: [-5.65, 0.05, 7.05] },
    fov: { desktop: 38, tablet: 44, mobile: 50 },
  },
  experience: {
    focus: sectionFocus("experience"),
    positions: { desktop: [-6.0, -1.45, 4.25], tablet: [-7.0, -0.95, 5.35], mobile: [-8.1, -0.25, 6.85] },
    fov: { desktop: 40, tablet: 46, mobile: 52 },
  },
  contact: {
    focus: [0, -0.35, 0],
    positions: { desktop: [5.6, 2.9, 7.8], tablet: [6.4, 3.5, 9.4], mobile: [7.5, 4.2, 11.4] },
    fov: { desktop: 40, tablet: 44, mobile: 50 },
  },
};

const projectFocus = landmarks
  .filter((landmark) => landmark.projectIndex !== undefined)
  .map((landmark) => toWorldFocus(landmark.position));

const projectViews: readonly ViewDefinition[] = [
  { focus: projectFocus[0], positions: { desktop: [-4.6, -1.15, 3.25], tablet: [-5.5, -0.65, 4.25], mobile: [-6.55, -0.05, 5.55] }, fov: { desktop: 36, tablet: 43, mobile: 49 } },
  { focus: projectFocus[1], positions: { desktop: [-3.45, -1.5, 4.05], tablet: [-4.35, -1.0, 5.05], mobile: [-5.35, -0.35, 6.45] }, fov: { desktop: 36, tablet: 43, mobile: 49 } },
  { focus: projectFocus[2], positions: { desktop: [4.65, -1.35, 3.8], tablet: [5.55, -0.85, 4.9], mobile: [6.65, -0.2, 6.3] }, fov: { desktop: 36, tablet: 43, mobile: 49 } },
  { focus: projectFocus[3], positions: { desktop: [4.05, -0.9, -4.25], tablet: [5.0, -0.4, -5.3], mobile: [6.15, 0.2, -6.65] }, fov: { desktop: 36, tablet: 43, mobile: 49 } },
  { focus: projectFocus[4], positions: { desktop: [4.6, -0.45, -3.2], tablet: [5.6, 0.05, -4.15], mobile: [6.8, 0.65, -5.45] }, fov: { desktop: 36, tablet: 43, mobile: 49 } },
];

const scenes = Object.fromEntries(
  (["desktop", "tablet", "mobile"] as const).map((viewport) => [
    viewport,
    Object.fromEntries(
      (Object.entries(sectionViews) as [SectionId, ViewDefinition][]).map(([section, definition]) => [
        section,
        framedScene(definition, viewport),
      ]),
    ) as Record<SectionId, CameraScene>,
  ]),
) as Record<ViewportKind, Record<SectionId, CameraScene>>;

export const getCameraScene = (section: SectionId, viewport: ViewportKind) =>
  scenes[viewport][section];

export const getDestinationCamera = (
  section: SectionId,
  projectIndex: number | null,
  viewport: ViewportKind,
) => projectIndex === null
  ? getCameraScene(section, viewport)
  : framedScene(projectViews[projectIndex] ?? projectViews[0], viewport);

export const getOrbitDistanceBounds = ({ position, target }: CameraScene) => {
  const distance = Math.hypot(
    position[0] - target[0],
    position[1] - target[1],
    position[2] - target[2],
  );

  return {
    minDistance: Math.max(1.5, distance * 0.55),
    maxDistance: distance * 1.45,
  };
};

export const getViewportKind = (width: number): ViewportKind =>
  width < 700 ? "mobile" : width < 1100 ? "tablet" : "desktop";
