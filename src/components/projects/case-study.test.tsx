import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProjectPage, { generateMetadata, generateStaticParams } from "@/app/projects/[slug]/page";
import ProjectNotFound from "@/app/projects/[slug]/not-found";
import sitemap from "@/app/sitemap";
import { caseStudies } from "@/config/case-studies";
import { landmarks } from "@/config/landmarks";
import { projects, siteUrl } from "@/config/portfolio";
import { ProjectDetail } from "../experience/ProjectDetail";
import { ProjectsSection } from "../sections/PortfolioSections";
import { useExperienceStore } from "@/store/experience";

vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NEXT_NOT_FOUND"); },
}));

describe("Meja engineering case study", () => {
  it("renders the shareable route with engineering sections and implementation boundaries", () => {
    render(<ProjectPage params={{ slug: "meja" }} />);
    expect(screen.getByRole("heading", { level: 1, name: "Meja" })).toBeInTheDocument();
    for (const name of ["Overview", "The problem", "Constraints", "Architecture", "Engineering decisions", "Failure states", "Performance", "What this enables"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "A retry must not become a second order." })).toBeInTheDocument();
    expect(screen.getByRole("note", { name: "Operating boundaries" })).toBeInTheDocument();
    expect(screen.getByText(/at most 12 hours/)).toBeInTheDocument();
    expect(screen.getByText(/mark the local entry synced/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to landmark" })).toHaveAttribute("href", "/#project-meja");
    expect(screen.getByRole("link", { name: "Visit Meja (opens in a new tab)" })).toHaveAttribute("href", "https://possum.farizz-a.workers.dev/");
  });

  it("keeps architecture stages in reading order and exposes details through native disclosures", async () => {
    const user = userEvent.setup();
    render(<ProjectPage params={{ slug: "meja" }} />);
    const flow = screen.getByRole("list", { name: "Local first, server validated flow" });
    const stages = Array.from(flow.children);
    expect(stages).toHaveLength(6);
    expect(within(stages[0] as HTMLElement).getByText("React cashier interface")).toBeInTheDocument();
    const stage = screen.getByText("Dexie / IndexedDB transaction");
    const disclosure = stage.closest("details");
    expect(disclosure).not.toHaveAttribute("open");
    await user.click(stage);
    expect(disclosure).toHaveAttribute("open");
    expect(screen.getByRole("list", { name: "Paths from Ordered synchronization" })).toBeInTheDocument();
    const failure = screen.getByText("Server rejects an operation");
    await user.click(failure);
    expect(failure.closest("details")).toHaveAttribute("open");
  });

  it("offers a skip link and valid section navigation targets", () => {
    const { container } = render(<ProjectPage params={{ slug: "meja" }} />);
    expect(screen.getByRole("link", { name: "Skip to case study" })).toHaveAttribute("href", "#case-content");
    expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
    const index = screen.getByRole("navigation", { name: "Case study sections" });
    for (const link of within(index).getAllByRole("link")) {
      expect(container.querySelector(link.getAttribute("href")!)).toBeInTheDocument();
    }
  });

  it("only enables Meja while preserving every existing city index and landmark", () => {
    expect(generateStaticParams()).toEqual([{ slug: "meja" }]);
    expect(projects.filter((project) => project.caseStudy).map((project) => project.slug)).toEqual(["meja"]);
    projects.forEach((project, index) => {
      expect(landmarks.find((landmark) => landmark.id === project.landmarkId)?.projectIndex).toBe(index);
    });
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    expect(caseStudies.every((study) => projects.some((project) => project.caseStudy && project.slug === study.slug))).toBe(true);
  });

  it.each(["unknown-project", "trace", "pixy", "constructor"])("returns not-found for unpublished slug %s", (slug) => {
    expect(() => ProjectPage({ params: { slug } })).toThrow("NEXT_NOT_FOUND");
    expect(generateMetadata({ params: { slug } }).robots).toEqual({ index: false });
  });

  it("provides a recovery link for missing projects", () => {
    render(<ProjectNotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "That project isn’t here." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to selected work" })).toHaveAttribute("href", "/#projects");
  });

  it("includes project-specific canonical, sharing metadata, and sitemap entry", () => {
    const metadata = generateMetadata({ params: { slug: "meja" } });
    expect(metadata.title).toBe("Meja — Offline-first restaurant POS");
    expect(metadata.alternates?.canonical).toBe(`${siteUrl}/projects/meja`);
    expect(metadata.openGraph).toMatchObject({ url: "/projects/meja", type: "article", description: caseStudies[0].positioning });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: ["/assets/images/possum.png"] });
    expect(sitemap().map(({ url }) => url)).toEqual([siteUrl, `${siteUrl}/projects/meja`]);
  });

  it("links the existing landmark preview to Meja without prefetching the reading route", () => {
    render(<ProjectDetail projectIndex={3} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Meja" });
    const entry = within(dialog).getByRole("link", { name: "Read Meja engineering case study" });
    expect(entry).toHaveAttribute("href", "/projects/meja");
    expect(entry).toHaveAttribute("data-prefetch", "false");
    expect(within(dialog).getByRole("link", { name: "View Meja repository" })).toBeInTheDocument();
  });

  it("keeps the case-study link available without WebGL, with no links to unimplemented studies", () => {
    useExperienceStore.setState({ selectedProject: null, staticMode: true });
    render(<ProjectsSection />);
    expect(screen.getByRole("link", { name: "Read Meja engineering case study" })).toHaveAttribute("href", "/projects/meja");
    expect(screen.queryByRole("link", { name: "Read Pixy engineering case study" })).not.toBeInTheDocument();
  });
});
