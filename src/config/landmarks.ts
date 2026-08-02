import type { Vec3 } from "./camera-scenes";
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
};

export const landmarks: readonly Landmark[] = [
  { id: "about-station", label: "ABOUT / EDUCATION", section: "about", position: [-1.72, -0.72, 0.72], asset: "neighborhood-storefront", color: "#ffb84d", hitRadius: 0.48 },
  { id: "skills-lab", label: "SKILLS LAB", section: "skills", position: [1.48, -0.94, 0.52], asset: "utility-facade", color: "#67e8f9", hitRadius: 0.48 },
  { id: "projects-district", label: "PROJECT DISTRICT", section: "projects", position: [0.22, -1.44, 1.02], asset: "shopping-street", color: "#ff4d9d", hitRadius: 0.48 },
  { id: "experience-line", label: "EXPERIENCE LINE", section: "experience", position: [-1.9, -1.95, 0.78], asset: "train-line", color: "#67e8f9", hitRadius: 0.48 },
  { id: "contact-overlook", label: "CONTACT", section: "contact", position: [-1.62, 1.52, -1.28], asset: "rooftop-overlook", color: "#ffb84d", hitRadius: 0.48 },
  { id: "project-soda", label: "01 / SODA CAN", section: "projects", position: [-1.38, -1.2, 0.66], asset: "vending-sign", color: "#67e8f9", hitRadius: 0.36, projectIndex: 0 },
  { id: "project-events", label: "02 / EVENTS", section: "projects", position: [-0.08, -1.84, 1.48], asset: "street-crossing", color: "#ff4d9d", hitRadius: 0.36, projectIndex: 1 },
  { id: "project-groceries", label: "03 / GROCERIES", section: "projects", position: [1.54, -1.68, 0.74], asset: "market-stall", color: "#ffb84d", hitRadius: 0.36, projectIndex: 2 },
  { id: "project-company", label: "04 / COMPANY", section: "projects", position: [0.72, -1.24, -1.46], asset: "street-facade", color: "#67e8f9", hitRadius: 0.36, projectIndex: 3 },
  { id: "project-invoeasy", label: "05 / INVOEASY", section: "projects", position: [1.5, -0.84, -0.52], asset: "office-window", color: "#ff4d9d", hitRadius: 0.36, projectIndex: 4 },
] as const;
