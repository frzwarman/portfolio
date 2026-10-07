export type ProjectGroup = "products" | "creative";

export type ProjectSummary = {
  slug: string;
  landmarkId: string;
  name: string;
  type: string;
  description: string;
  concept?: string;
  group?: ProjectGroup;
  /** Editorial order is independent of the city's existing landmark indices. */
  priority?: number;
  featured?: boolean;
  caseStudy: boolean;
  stack: readonly string[];
  href: string;
  repository?: string;
  image: string;
  accent: "cyan" | "amber" | "magenta";
};

export type ArchitectureStep = {
  label: string;
  detail: string;
  branches?: readonly { label: string; detail: string; continues?: boolean }[];
};

export type ArchitectureFlow = {
  title: string;
  description: string;
  steps: readonly ArchitectureStep[];
};

export type ProjectCaseStudy = {
  slug: string;
  positioning: string;
  role: readonly string[];
  status: string;
  overview: string;
  problem: string;
  constraints: readonly { title: string; description: string }[];
  architecture: readonly ArchitectureFlow[];
  hardProblem: { title: string; problem: string; solution: string; steps: readonly string[] };
  decisions: readonly { decision: string; why: string; tradeoff: string }[];
  failureStates: readonly { trigger: string; response: string }[];
  performance: readonly { strategy: string; detail: string }[];
  results: readonly string[];
  limitations: string;
  /** Source paths are relative to the linked project repository, never machine paths. */
  sources: readonly { label: string; path: string }[];
};
