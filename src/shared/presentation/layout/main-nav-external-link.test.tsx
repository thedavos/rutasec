// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { MainNavExternalLink } from "#/shared/presentation/layout/main-nav-external-link";
import { RUTASEC_GITHUB_URL } from "#/shared/presentation/layout/public-nav.constants";

afterEach(() => {
  cleanup();
});

describe("MainNavExternalLink", () => {
  it("renders an external link with safe attributes", () => {
    render(<MainNavExternalLink href={RUTASEC_GITHUB_URL} label="GitHub" />);

    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link.getAttribute("href")).toBe(RUTASEC_GITHUB_URL);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
