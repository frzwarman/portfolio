import type { Vec3, ViewportKind } from "./camera-scenes";
import type { SectionId } from "./portfolio";

export type Landmark = {
  id: string;
  label: string;
  section: SectionId;
  position: Vec3;
  asset: string;
  color: string;
  hitRadius: number;
  projectIndex?: number;
  /** Camera position per viewport when this landmark is a project destination. */
  view?: Record<ViewportKind, Vec3>;
  /** Point to frame instead of the beacon (rooftop statues sit beside their beacon). */
  focus?: Vec3;
  fov?: Partial<Record<ViewportKind, number>>;
};

export const landmarks: readonly Landmark[] = [
  { id: "about-station", label: "ABOUT / EDUCATION", section: "about", position: [-1.72, -0.72, 0.72], asset: "neighborhood-storefront", color: "#ffb84d", hitRadius: 0.48 },
  { id: "skills-lab", label: "SKILLS LAB", section: "skills", position: [1.48, -0.94, 0.52], asset: "utility-facade", color: "#67e8f9", hitRadius: 0.48 },
  { id: "projects-district", label: "PROJECT DISTRICT", section: "projects", position: [0.22, -1.44, 1.02], asset: "shopping-street", color: "#ff4d9d", hitRadius: 0.48 },
  { id: "experience-line", label: "EXPERIENCE LINE", section: "experience", position: [-1.9, -1.95, 0.78], asset: "train-line", color: "#67e8f9", hitRadius: 0.48 },
  { id: "contact-overlook", label: "CONTACT", section: "contact", position: [-1.62, 1.52, -1.28], asset: "rooftop-overlook", color: "#ffb84d", hitRadius: 0.48 },
  { id: "project-soda", label: "SODA CAN", section: "projects", position: [-1.38, -1.2, 0.66], asset: "vending-sign", color: "#67e8f9", hitRadius: 0.36, projectIndex: 0, view: { desktop: [-4.6, -1.15, 3.25], tablet: [-5.5, -0.65, 4.25], mobile: [-6.55, -0.05, 5.55] } },
  { id: "project-pokedex", label: "POKÉDEX", section: "projects", position: [0.55, 2.18, 1.28], asset: "rooftop-cat-statue", color: "#ffb84d", hitRadius: 0.42, projectIndex: 1, focus: [0.45, 1.58, 1.2], view: { desktop: [4.75, 2.35, 4.9], tablet: [5.65, 2.9, 5.8], mobile: [6.75, 3.55, 7.05] }, fov: { desktop: 35, tablet: 42, mobile: 48 } },
  { id: "project-arus", label: "ARUS", section: "projects", position: [-1.1, -0.2, -1.5], asset: "back-alley-office", color: "#ff4d9d", hitRadius: 0.42, projectIndex: 2, view: { desktop: [-2.71, -0.5, -5.86], tablet: [-3.13, -0.1, -6.77], mobile: [-3.67, 0.5, -7.95] } },
  { id: "project-meja", label: "MEJA", section: "projects", position: [1.78, -1.72, 0.92], asset: "market-stall", color: "#ffb84d", hitRadius: 0.42, projectIndex: 3, view: { desktop: [4.65, -1.35, 3.8], tablet: [5.55, -0.85, 4.9], mobile: [6.65, -0.2, 6.3] } },
  { id: "project-siteos", label: "SITEOS", section: "projects", position: [0.72, -1.24, -1.46], asset: "street-facade", color: "#67e8f9", hitRadius: 0.42, projectIndex: 4, view: { desktop: [4.05, -0.9, -4.25], tablet: [5.0, -0.4, -5.3], mobile: [6.15, 0.2, -6.65] } },
  { id: "project-pixy", label: "PIXY", section: "projects", position: [0.05, 1.3, -0.4], asset: "rooftop-lightbox", color: "#ff4d9d", hitRadius: 0.42, projectIndex: 5, view: { desktop: [1.51, 1.0, 3.99], tablet: [1.81, 1.4, 4.94], mobile: [2.2, 2.0, 6.17] } },
] as const;
