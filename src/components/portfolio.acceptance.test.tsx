import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useExperienceStore } from "@/store/experience";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Services from "./Services";
import { ExperienceInterface } from "./experience/ExperienceInterface";

describe("portfolio redesign acceptance", () => {
  beforeEach(() => {
    useExperienceStore.setState({ activeSection: "intro", selectedProject: null, interactionPhase: "overview" });
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

  it("gives every retained project a descriptive link", () => {
    render(<Services />);

    for (const name of [
      "3D Soda Can",
      "Event Management Platform",
      "E-Groceries",
      "Company Profile",
      "Invoeasy",
      "Pokédex",
    ]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("exposes the Pokédex live project and source repository", async () => {
    const user = userEvent.setup();
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
    render(<Services />);

    const exploreButton = screen.getByRole("button", { name: "Explore 3D Soda Can" });
    await user.click(exploreButton);

    expect(
      screen.getByRole("dialog", { name: "3D Soda Can" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visit 3D Soda Can" })).toHaveAttribute(
      "href",
      "http://3d-soda-can-gilt.vercel.app/",
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
      "https://github.com/farizwrmn",
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
});
