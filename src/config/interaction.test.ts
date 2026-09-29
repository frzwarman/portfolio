import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { getDestinationCamera, getOrbitDistanceBounds, type ViewportKind } from "./camera-scenes";
import { landmarks } from "./landmarks";
import { projects, sectionIds } from "./portfolio";

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

  it("keeps every guided camera destination inside its zoom and polar range", () => {
    // If a destination violates OrbitControls' limits, the controls push the camera
    // back every frame while the rig lerps it in, so the trip never "arrives" and the
    // scene stays locked in the travelling phase.
    const viewports: ViewportKind[] = ["desktop", "tablet", "mobile"];
    const destinations = [
      ...sectionIds.map((section) => ({ section, project: null })),
      ...landmarks
        .filter((landmark) => landmark.projectIndex !== undefined)
        .map((landmark) => ({ section: "projects" as const, project: landmark.projectIndex ?? 0 })),
    ];

    for (const viewport of viewports) {
      for (const destination of destinations) {
        const scene = getDestinationCamera(destination.section, destination.project, viewport);
        const dx = scene.position[0] - scene.target[0];
        const dy = scene.position[1] - scene.target[1];
        const dz = scene.position[2] - scene.target[2];
        const distance = Math.hypot(dx, dy, dz);
        const polarAngle = Math.acos(dy / distance);
        const bounds = getOrbitDistanceBounds(scene);
        const label = `${destination.section}/${destination.project ?? "-"}@${viewport}`;

        expect(bounds.minDistance, label).toBeLessThan(distance);
        expect(bounds.maxDistance, label).toBeGreaterThan(distance);
        expect(bounds.maxDistance, label).toBeGreaterThanOrEqual(distance * 3.25);
        expect(polarAngle, label).toBeGreaterThan(Math.PI * 0.2);
        expect(polarAngle, label).toBeLessThan(Math.PI * 0.48);
      }
    }
  });

  it("lays out project minimize and close controls in one horizontal row", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const actionRule = css.match(/\.landmark-detail__window-actions\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(actionRule).toMatch(/display\s*:\s*flex/);
    expect(actionRule).toMatch(/align-items\s*:\s*center/);
  });

  it("distributes section destinations across the city instead of clustering on rooftops", () => {
    const sectionLandmarks = landmarks.filter((landmark) => landmark.projectIndex === undefined);
    const levels = sectionLandmarks.map((landmark) => landmark.position[1]);
    const experience = sectionLandmarks.find((landmark) => landmark.section === "experience");

    expect(Math.max(...levels) - Math.min(...levels)).toBeGreaterThanOrEqual(1.2);
    expect(experience?.asset).toBe("train-line");
    expect(experience?.position[1]).toBeLessThanOrEqual(0.15);
  });

  it("gives every project exactly one landmark, with its own asset and camera view", () => {
    const projectLandmarks = landmarks.filter((landmark) => landmark.projectIndex !== undefined);

    expect(new Set(projectLandmarks.map((landmark) => landmark.asset)).size).toBe(projectLandmarks.length);
    expect(projectLandmarks.map((landmark) => landmark.projectIndex)).toEqual(projects.map((_, index) => index));
    expect(projectLandmarks.every((landmark) => landmark.view !== undefined)).toBe(true);
  });

  it("scatters project landmarks across the city instead of clustering them", () => {
    const projectLandmarks = landmarks.filter((landmark) => landmark.projectIndex !== undefined);

    for (const a of projectLandmarks) {
      for (const b of projectLandmarks) {
        if (a === b) continue;
        const distance = Math.hypot(a.position[0] - b.position[0], a.position[1] - b.position[1], a.position[2] - b.position[2]);
        expect(distance, `${a.id} vs ${b.id}`).toBeGreaterThanOrEqual(1.5);
      }
    }
  });

  it("places Pokédex at the rooftop cat statue with left-side desktop framing", () => {
    const pokedex = landmarks.find((landmark) => landmark.projectIndex === 1);
    const contact = landmarks.find((landmark) => landmark.section === "contact");

    expect(pokedex?.asset).toBe("rooftop-cat-statue");
    expect(pokedex?.label).toBe("POKÉDEX");
    expect(pokedex?.position[1]).toBeGreaterThan(1);
    expect(pokedex?.position[0]).toBeGreaterThan(0.2);
    expect(pokedex?.position[2]).toBeGreaterThan(0.8);
    expect(
      Math.hypot(
        (pokedex?.position[0] ?? 0) - (contact?.position[0] ?? 0),
        (pokedex?.position[1] ?? 0) - (contact?.position[1] ?? 0),
        (pokedex?.position[2] ?? 0) - (contact?.position[2] ?? 0),
      ),
    ).toBeGreaterThan(0.9);

    const scene = getDestinationCamera("projects", 1, "desktop");
    const projection = projectFocus(scene, 16 / 9);
    expect(projection.x).toBeGreaterThan(-0.72);
    expect(projection.x).toBeLessThan(-0.08);
  });

  it("keeps drag and wheel exploration enabled while project details are open", () => {
    const cameraRig = fs.readFileSync(
      path.join(process.cwd(), "src/components/experience/CameraRig.tsx"),
      "utf8",
    );
    const canExploreRule = cameraRig.match(/const canExplore = ([^;]+);/)?.[1] ?? "";

    expect(canExploreRule).toContain('phase === "detail-open"');
  });

  it("keeps manual drag and zoom enabled for reduced-motion users", () => {
    const cameraRig = fs.readFileSync(
      path.join(process.cwd(), "src/components/experience/CameraRig.tsx"),
      "utf8",
    );
    const canExploreRule = cameraRig.match(/const canExplore = ([^;]+);/)?.[1] ?? "";

    expect(canExploreRule).not.toContain("reducedMotion");
  });

  it("keeps every navigation destination reachable on short and mobile viewports", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const navigationRule = css.match(/\.site-nav\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(navigationRule).toMatch(/height\s*:\s*100dvh/);
    expect(navigationRule).toMatch(/overflow-y\s*:\s*auto/);
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
