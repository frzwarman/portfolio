import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { projects } from "@/config/portfolio";
import { useExperienceStore } from "@/store/experience";
import { ExperienceInterface } from "./experience/ExperienceInterface";
import Navbar from "./navigation/Navigation";
import { ContactSection as Contact, ProjectsSection as Services } from "./sections/PortfolioSections";

describe("portfolio redesign acceptance", () => {
  beforeEach(() => {
    useExperienceStore.setState({ activeSection: "intro", selectedProject: null, interactionPhase: "overview", panelExpanded: true, staticMode: false });
  });
  it("navigates to semantic homepage sections", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute(
      "href",
      "#skills",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "#about",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "#contact",
    );

    await user.click(screen.getByRole("link", { name: "Skills" }));
    expect(useExperienceStore.getState().activeSection).toBe("skills");
  });

  it("offers an overview destination for returning to the city view", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "#intro",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "#about",
    );
  });

  it("links every retained project to its deployed app", () => {
    render(<Services />);

    const deployed = {
      "3D Soda Can": "https://3d-soda-can-gilt.vercel.app/",
      "Pokédex": "https://pensieve-test-two.vercel.app/",
      "Arus": "https://arus-finance.farizz-a.workers.dev/",
      "Meja": "https://possum.farizz-a.workers.dev/",
      "SiteOS": "https://siteos-studio.farizz-a.workers.dev/",
      "Pixy": "https://pixys.farizz-a.workers.dev/",
    };
    expect(screen.getAllByRole("article")).toHaveLength(Object.keys(deployed).length);
    for (const [name, href] of Object.entries(deployed)) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("keeps a repository link for every project that has one", () => {
    render(<Services />);

    for (const project of projects) {
      if (!("repository" in project)) continue;
      expect(screen.getByRole("link", { name: `View ${project.name} repository` })).toHaveAttribute("href", project.repository);
    }
  });

  it("exposes the Pokédex live project and source repository", async () => {
    const user = userEvent.setup();
    useExperienceStore.setState({ staticMode: true });
    render(<Services />);

    await user.click(screen.getByRole("button", { name: "Explore Pokédex" }));

    const dialog = screen.getByRole("dialog", { name: "Pokédex" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Visit Pokédex" })).toHaveAttribute(
      "href",
      "https://pensieve-test-two.vercel.app/",
    );
    expect(within(dialog).getByRole("link", { name: "View Pokédex repository" })).toHaveAttribute(
      "href",
      "https://github.com/frzwarman/pensieve-test",
    );
  });

  it("opens project content as an accessible landmark detail", async () => {
    const user = userEvent.setup();
    useExperienceStore.setState({ staticMode: true });
    render(<Services />);

    const exploreButton = screen.getByRole("button", { name: "Explore 3D Soda Can" });
    await user.click(exploreButton);

    expect(
      screen.getByRole("dialog", { name: "3D Soda Can" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visit 3D Soda Can" })).toHaveAttribute(
      "href",
      "https://3d-soda-can-gilt.vercel.app/",
    );

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "3D Soda Can" }),
    ).not.toBeInTheDocument();
    expect(exploreButton).toHaveFocus();
  });

  it("exposes every contact method as a keyboard-accessible link", () => {
    render(<Contact />);

    expect(screen.getByRole("link", { name: "Email Fariz" })).toHaveAttribute(
      "href",
      "mailto:farizwarman@gmail.com",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/frzwarman",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/frzwarman/",
    );
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me"),
    );
  });

  it("returns keyboard focus to a project landmark after closing its detail", async () => {
    const user = userEvent.setup();
    useExperienceStore.setState({ activeSection: "projects", interactionPhase: "exploring" });
    render(<ExperienceInterface />);

    await user.click(screen.getByRole("button", { name: "01 3D Soda Can" }));
    act(() => useExperienceStore.getState().setInteractionPhase("detail-open"));
    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.getByRole("button", { name: "01 3D Soda Can" })).toHaveFocus());
    expect(window.location.hash).toBe("#projects");
  });

  it("toggles the active district panel from its navigation destination", async () => {
    const user = userEvent.setup();
    useExperienceStore.setState({ activeSection: "projects", interactionPhase: "exploring", panelExpanded: true });
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
    await user.click(screen.getByRole("link", { name: "Projects" }));
    expect(useExperienceStore.getState().panelExpanded).toBe(false);

    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
    await user.click(screen.getByRole("link", { name: "Projects" }));
    expect(useExperienceStore.getState().panelExpanded).toBe(true);
  });

  it("minimizes a district panel to an accessible persistent restore control", async () => {
    const user = userEvent.setup();
    useExperienceStore.setState({ activeSection: "projects", interactionPhase: "exploring", panelExpanded: true });
    render(<ExperienceInterface />);

    await user.click(screen.getByRole("button", { name: "Minimize Project district information" }));
    expect(screen.queryByRole("heading", { name: /builds, one city/i })).not.toBeInTheDocument();

    const restore = screen.getByRole("button", { name: "Expand Project district information" });
    await user.click(restore);
    expect(screen.getByRole("heading", { name: /builds, one city/i })).toBeInTheDocument();
  });

  it("groups project minimize and close controls side by side", async () => {
    const user = userEvent.setup();
    useExperienceStore.setState({ activeSection: "projects", interactionPhase: "exploring", panelExpanded: true });
    render(<ExperienceInterface />);

    await user.click(screen.getByRole("button", { name: "01 3D Soda Can" }));
    const minimize = screen.getByRole("button", { name: "Minimize 3D Soda Can information" });
    const close = screen.getByRole("button", { name: "Close 3D Soda Can" });

    expect(minimize.parentElement).toBe(close.parentElement);
    expect(minimize.parentElement).toHaveClass("landmark-detail__window-actions");
  });

  it("opens a different navigation destination with its panel expanded", async () => {
    const user = userEvent.setup();
    useExperienceStore.setState({ activeSection: "projects", interactionPhase: "exploring", panelExpanded: false });
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
    await user.click(screen.getByRole("link", { name: "Skills" }));

    expect(useExperienceStore.getState().activeSection).toBe("skills");
    expect(useExperienceStore.getState().panelExpanded).toBe(true);
  });
});
