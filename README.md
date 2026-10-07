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
npm run typecheck
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

## Engineering case studies

Meja is the first case study, at `/projects/meja`. The homepage, other projects,
city model, landmark positions, camera framing, and navigation retain their existing design.

- `src/config/project-types.ts` defines typed summaries, case-study sections, architecture stages/branches, decisions, and failure states.
- `src/config/portfolio.ts` remains the lightweight summary registry. Stable slugs and `landmarkId` connect reading pages to city destinations; `caseStudy` controls entry links. Optional group, priority, and featured fields support later editorial hierarchy without reordering city indices.
- `src/config/case-studies.ts` holds long-form content separately from the city’s client bundle. Only Meja is enabled.
- `src/app/projects/[slug]/page.tsx` prerenders available studies, generates project metadata, and sends absent/unpublished slugs to the project recovery page.
- `src/components/projects/CaseStudy.tsx` and `ArchitectureDiagram.tsx` render the shared reading experience on the server. Native disclosures work without application JavaScript. `continues` identifies a branch that leads to the next architecture stage; offline branches end locally.
- `src/app/projects/layout.tsx` loads route-specific CSS. Case-study pages never mount the Three.js experience, and entry/return links disable speculative prefetching.

### Audit and content provenance

The existing Next.js App Router, small Zustand selectors, Draco model loading,
shader precompilation, capped DPR, responsive camera destinations, and WebGL-loss
fallback were preserved. The original compact project dialog and semantic project
cards now offer a Meja engineering-story link. A separate reading route avoids
putting a long document inside a mobile city sheet or loading WebGL for a shared link.
Inter, Dirtyline, dark ink, and the amber Meja landmark signal carry into the reading layer.

Meja content was checked against the local `possum` implementation: its README,
`src/lib/commands.ts`, `src/lib/db.ts`, `src/lib/sync.ts`, and the core/operations
Postgres migrations. Source links on the page point to the public repository.
The page describes acknowledged outbox entries as retained with `synced` state,
ordered replay with Web Locks and retry backoff, idempotency by stable operation ID,
and the documented limits of an authorized offline shift. It claims no customer
counts, business outcomes, latency measurements, or hardware validation. Role
attribution assumes this is the owner’s implementation, as described in the portfolio brief.

### Adding another case study or Trace later

1. Add verified structured content to `caseStudies` using an existing project’s slug, and enable its summary’s `caseStudy` flag. The route, metadata, sitemap, diagrams, and links then reuse the same components.
2. For a new project, append its summary and city landmark with a matching index; use a stable slug and `landmarkId`. Keep the existing project indices intact.
3. Use optional `featured` and `priority` for future editorial placement. A future request graph or timeline can be added as a typed section when its real implementation exists. No Trace content or route is present now.

Verification includes route/metadata/not-found tests, source/landmark registry checks,
native disclosure interactions, fallback entry links, and the existing city navigation
and camera acceptance suite. Browser checks cover phone/desktop layout, keyboard
activation, skip-link focus, and reduced motion. Automated accessibility checks
supplement those checks; they do not establish complete WCAG conformance.

Camera movement has two stages: `CameraRig.tsx` flies to the configured destination, then enables constrained orbit and zoom controls. Keep section framing in `camera-scenes.ts`; keep project-specific target offsets in `landmarks.ts`.

## Model replacement

Replace `public/assets/models/LittlestTokyo.glb`, then recalibrate every camera state against the new model’s bounds and scale. If the replacement uses Draco compression, keep decoder files in `public/assets/draco/`; otherwise remove the decoder argument in `TokyoWorld.tsx`.

## Performance and accessibility

The app chooses low/medium/high quality from capability signals and caps DPR at 1/1.5/2. Low quality disables antialiasing and shadows. Animation is reduced when the page is hidden. `prefers-reduced-motion` shortens camera travel and disables free-look motion; navigation also exposes a manual motion control. WebGL failure activates the full semantic fallback with all headings, projects, and contact links. Landmarks are pointer/touch targets, while the menu and accessible DOM dialogs provide keyboard parity.

## Attribution

The 3D layer uses **Littlest Tokyo** by **Glen Fox**, distributed with the official [Three.js animation keyframes example](https://threejs.org/examples/#webgl_animation_keyframes). Three.js, React Three Fiber, and Drei power rendering and guided controls. No assets, branding, or content from the visual inspiration site are copied.
