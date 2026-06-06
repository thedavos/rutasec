// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("SiteFooter", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/resources/web-security");
    setLocaleMock.mockClear();
  });

  afterEach(() => {
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
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText,
      },
    });

    render(<SiteFooter />);

    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(await screen.findByText("Link copied.")).toBeTruthy();
  });

  it("shows non-blocking failure feedback when clipboard access is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });

    render(<SiteFooter />);

    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() => {
      expect(screen.getByText("Could not copy link.")).toBeTruthy();
    });
  });
});
