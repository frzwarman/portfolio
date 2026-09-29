export type QualityTier = "medium" | "low";

export function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  // deviceMemory is Chromium-only; an unknown value means "capable", not "4 GB".
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 4 || memory <= 4 ? "low" : "medium";
}

export const qualityDpr: Record<QualityTier, [number, number]> = {
  low: [1, 1],
  medium: [1, 1.5],
};

export function supportsWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
