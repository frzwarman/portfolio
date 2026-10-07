import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/portfolio";
import { caseStudies } from "@/config/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map(({ slug }) => ({
      url: `${siteUrl}/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
