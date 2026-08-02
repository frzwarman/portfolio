import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { getDestinationCamera, getOrbitDistanceBounds, type ViewportKind } from "./camera-scenes";
import { landmarks } from "./landmarks";
import { sectionIds } from "./portfolio";

describe("3D interaction affordances", () => {
  it("keeps the canvas vignette from intercepting drag, wheel, and landmark input", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const vignetteRule = css.match(/\.canvas-vignette\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(vignetteRule).toMatch(/pointer-events\s*:\s*none/);
  });

  it("gives every landmark a forgiving raycast target", () => {
    for (const landmark of landmarks) {
      expect("hitRadius" in landmark).toBe(true);
      if ("hitRadius" in landmark) {
        expect(Number(landmark.hitRadius)).toBeGreaterThanOrEqual(0.32);
      }
    }
  });

  it("keeps every guided camera destination inside its zoom range", () => {
    const viewports: ViewportKind[] = ["desktop", "tablet", "mobile"];

    for (const viewport of viewports) {
      for (const section of sectionIds) {
        const scene = getDestinationCamera(section, null, viewport);
        const distance = Math.hypot(
          scene.position[0] - scene.target[0],
          scene.position[1] - scene.target[1],
          scene.position[2] - scene.target[2],
        );
        const bounds = getOrbitDistanceBounds(scene);

        expect(bounds.minDistance).toBeLessThan(distance);
        expect(bounds.maxDistance).toBeGreaterThan(distance);
      }
    }
  });

  it("distributes section destinations across the city instead of clustering on rooftops", () => {
    const sectionLandmarks = landmarks.filter((landmark) => landmark.projectIndex === undefined);
    const levels = sectionLandmarks.map((landmark) => landmark.position[1]);
    const experience = sectionLandmarks.find((landmark) => landmark.section === "experience");

    expect(Math.max(...levels) - Math.min(...levels)).toBeGreaterThanOrEqual(1.2);
    expect(experience?.asset).toBe("train-line");
    expect(experience?.position[1]).toBeLessThanOrEqual(0.15);
  });

  it("pins every project to a distinct street-level city asset", () => {
    const projectLandmarks = landmarks.filter((landmark) => landmark.projectIndex !== undefined);
    const groceries = projectLandmarks.find((landmark) => landmark.projectIndex === 2);

    expect(new Set(projectLandmarks.map((landmark) => landmark.asset)).size).toBe(5);
    expect(projectLandmarks.every((landmark) => landmark.position[1] <= 0.55)).toBe(true);
    expect(groceries?.asset).toBe("market-stall");
  });

  it("frames destination assets in the unobstructed desktop area and above mobile sheets", () => {
    const destinations = [
      ...sectionIds.filter((section) => section !== "intro").map((section) => ({ section, project: null })),
      ...landmarks
        .filter((landmark) => landmark.projectIndex !== undefined)
        .map((landmark) => ({ section: "projects" as const, project: landmark.projectIndex ?? 0 })),
    ];

    for (const destination of destinations) {
      const desktop = getDestinationCamera(destination.section, destination.project, "desktop");
      const mobile = getDestinationCamera(destination.section, destination.project, "mobile");
      const desktopProjection = projectFocus(desktop, 16 / 9);
      const mobileProjection = projectFocus(mobile, 9 / 16);

      expect(desktopProjection.x).toBeGreaterThan(-0.72);
      expect(desktopProjection.x).toBeLessThan(-0.08);
      expect(mobileProjection.y).toBeGreaterThan(0.08);
    }
  });
});

function projectFocus(
  scene: ReturnType<typeof getDestinationCamera>,
  aspect: number,
) {
  const camera = new THREE.PerspectiveCamera(scene.fov, aspect, 0.1, 100);
  camera.position.fromArray(scene.position);
  camera.lookAt(new THREE.Vector3().fromArray(scene.target));
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  return new THREE.Vector3().fromArray(scene.focus).project(camera);
}
