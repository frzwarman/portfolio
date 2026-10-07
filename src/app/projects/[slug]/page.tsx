import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { caseStudies, getCaseStudy } from "@/config/case-studies";
import { projects, siteUrl } from "@/config/portfolio";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = projects.find((item) => item.slug === params.slug);
  const study = getCaseStudy(params.slug);
  if (!project || !study) return { title: "Project not found", robots: { index: false } };
  const title = `${project.name} — ${project.type}`;
  const url = `/projects/${project.slug}`;
  return {
    title, description: study.positioning, alternates: { canonical: `${siteUrl}${url}` },
    openGraph: { title, description: study.positioning, url, type: "article", images: [{ url: project.image, width: 960, height: 540, alt: `${project.name} interface` }] },
    twitter: { card: "summary_large_image", title, description: study.positioning, images: [project.image] },
  };
}

export default function ProjectPage({ params }: Props) {
  const project = projects.find((item) => item.slug === params.slug);
  const study = getCaseStudy(params.slug);
  if (!project || !study) notFound();
  return <CaseStudy project={project} study={study} />;
}
