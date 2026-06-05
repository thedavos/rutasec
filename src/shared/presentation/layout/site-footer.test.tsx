// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { RUTASEC_GITHUB_URL } from "#/shared/constants/rutasec-github";
import { SiteFooter } from "#/shared/presentation/layout/site-footer";

const { setLocaleMock } = vi.hoisted(() => ({
  setLocaleMock: vi.fn(),
}));

vi.mock("#/paraglide/runtime.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("#/paraglide/runtime.js")>();

  return {
    ...actual,
    setLocale: setLocaleMock,
  };
});

const shareFeedbackClearDelayMs = 3000;

describe("SiteFooter", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/resources/web-security");
    setLocaleMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    cleanup();
  });

  it("links users to the RutaSec GitHub repository", () => {
    render(<SiteFooter />);

    expect(screen.getByText(/repository-backed cybersecurity learning catalog/i)).toBeTruthy();

    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink.getAttribute("href")).toBe(RUTASEC_GITHUB_URL);
    expect(githubLink.getAttribute("target")).toBe("_blank");
    expect(githubLink.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("lets users switch locale from the footer selector", () => {
    render(<SiteFooter />);

    fireEvent.click(screen.getByRole("button", { name: "es" }));

    expect(setLocaleMock).toHaveBeenCalledWith("es");
  });

  it("copies the current page URL and shows success feedback", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText,
      },
    });

    render(<SiteFooter />);

    await clickShare();

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByText("Link copied.")).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(shareFeedbackClearDelayMs);
    });

    expect(screen.queryByText("Link copied.")).toBeNull();
  });

  it("shows non-blocking failure feedback when clipboard access is unavailable", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });

    render(<SiteFooter />);

    await clickShare();

    expect(screen.getByText("Could not copy link.")).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(shareFeedbackClearDelayMs);
    });

    expect(screen.queryByText("Could not copy link.")).toBeNull();
  });

  it("keeps feedback visible for the full delay after the latest share attempt", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText,
      },
    });

    render(<SiteFooter />);

    await clickShare();
    expect(screen.getByText("Link copied.")).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(shareFeedbackClearDelayMs - 1000);
    });
    await clickShare();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText("Link copied.")).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(shareFeedbackClearDelayMs - 1000);
    });

    expect(screen.queryByText("Link copied.")).toBeNull();
  });
});

async function clickShare() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    await Promise.resolve();
  });
}
