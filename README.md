# Muhamad Fariz Warman — Portfolio

An accessible, 3D-first portfolio built with Next.js, React Three Fiber, the Three.js Littlest Tokyo model, Drei, Zustand, and semantic HTML. Navigation flies through an explorable city, where interactive landmarks reveal portfolio content.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run lint
npm run build
```

## Architecture

- `src/components/PortfolioExperience.tsx` composes the fixed 3D layer, loading gate, guided navigation, interactive interface, and semantic fallback.
- `src/components/experience/` owns the R3F canvas, animated model, camera rig, runtime landmarks, project dialog, navigation director, real asset loader, and static fallback.
- `src/components/sections/` contains the crawlable fallback portfolio. All content and links remain usable without WebGL.
- `src/config/portfolio.ts` is the source of truth for projects, roles, skills, contact details, and section IDs.
- `src/config/landmarks.ts` maps section and project IDs to runtime city markers, project targets, and project camera offsets.
- `src/config/camera-scenes.ts` stores independent camera position, look-at target, and FOV for desktop, tablet, and mobile destinations.
- `src/store/experience.ts` synchronizes navigation phase, active section, camera destination, selected project, quality, motion preference, and readiness.

## Extending the experience

To add a section:

1. Add its ID to `sectionIds` in `src/config/portfolio.ts`.
2. Add desktop/tablet/mobile framing to `src/config/camera-scenes.ts`.
3. Add a section landmark to `src/config/landmarks.ts` and place it against the city model.
4. Add its compact panel to `ExperienceInterface.tsx` and its full semantic fallback to `PortfolioSections.tsx`.
5. Add its navigation link. `NavigationDirector` restores the corresponding destination from URL history.

Projects live in `src/config/portfolio.ts`. Add the corresponding project landmark and model-space position in `src/config/landmarks.ts`; its `projectIndex` must match the project array index. Pointer, touch, menu, hash, and dialog behavior then share that registry.

Camera movement has two stages: `CameraRig.tsx` flies to the configured destination, then enables constrained orbit and zoom controls. Keep section framing in `camera-scenes.ts`; keep project-specific target offsets in `landmarks.ts`.

## Model replacement

Replace `public/assets/models/LittlestTokyo.glb`, then recalibrate every camera state against the new model’s bounds and scale. If the replacement uses Draco compression, keep decoder files in `public/assets/draco/`; otherwise remove the decoder argument in `TokyoWorld.tsx`.

## Performance and accessibility

The app chooses low/medium/high quality from capability signals and caps DPR at 1/1.5/2. Low quality disables antialiasing and shadows. Animation is reduced when the page is hidden. `prefers-reduced-motion` shortens camera travel and disables free-look motion; navigation also exposes a manual motion control. WebGL failure activates the full semantic fallback with all headings, projects, and contact links. Landmarks are pointer/touch targets, while the menu and accessible DOM dialogs provide keyboard parity.

## Attribution

The 3D layer uses **Littlest Tokyo** by **Glen Fox**, distributed with the official [Three.js animation keyframes example](https://threejs.org/examples/#webgl_animation_keyframes). Three.js, React Three Fiber, and Drei power rendering and guided controls. No assets, branding, or content from the visual inspiration site are copied.
