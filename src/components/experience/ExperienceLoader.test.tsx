import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useExperienceStore } from "@/store/experience";

vi.mock("@react-three/drei", () => ({ useProgress: () => ({ progress: 100, errors: [] }) }));

import { ExperienceLoader } from "./ExperienceLoader";

describe("experience loader auto-entry", () => {
  beforeEach(() => {
    useExperienceStore.setState({ started: false, assetsReady: false });
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: { getItem: () => null, setItem: () => {} },
    });
    Object.defineProperty(window.Image.prototype, "src", {
      configurable: true,
      set(this: HTMLImageElement) {
        this.onload?.(new Event("load"));
      },
    });
  });

  it("starts the portfolio on its own once loading completes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<ExperienceLoader onRetry={() => {}} />);

    for (let step = 0; step < 200; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        vi.advanceTimersByTime(64);
      });
      if (useExperienceStore.getState().started) break;
    }

    expect(useExperienceStore.getState().started).toBe(true);
    vi.useRealTimers();
  });
});
