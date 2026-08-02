export type QualityTier = "high" | "medium" | "low";

export function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
  if (cores <= 4 || memory <= 4) return "low";
  if (cores <= 8 || memory <= 8) return "medium";
  return "high";
}

export const qualityDpr: Record<QualityTier, [number, number]> = {
  low: [1, 1],
  medium: [1, 1.5],
  high: [1, 2],
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
