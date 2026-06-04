// @vitest-environment jsdom

import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { PublicNavGroup } from "#/shared/presentation/layout/public-nav-group";
import { RUTASEC_GITHUB_URL } from "#/shared/presentation/layout/public-nav.constants";
import {
  expectNavLinkActive,
  expectNavLinkInactive,
  renderNavLink,
} from "#/shared/presentation/testing/render-nav-link";

beforeEach(() => {
  vi.stubGlobal("scrollTo", vi.fn());
});

afterEach(() => {
  cleanup();
});

describe("PublicNavGroup", () => {
  it("always renders GitHub and Send Resource links", async () => {
    await renderNavLink("/", PublicNavGroup);

    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink.getAttribute("href")).toBe(RUTASEC_GITHUB_URL);
    expect(githubLink.getAttribute("target")).toBe("_blank");
    expect(githubLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.getByRole("link", { name: "Send Resource" })).toBeTruthy();
  });

  it("marks Send Resource active on the send-resource route", async () => {
    await renderNavLink("/send-resource", PublicNavGroup);

    expectNavLinkActive(screen.getByRole("link", { name: "Send Resource" }));
  });

  it("marks Send Resource inactive on catalog", async () => {
    await renderNavLink("/", PublicNavGroup);

    expectNavLinkInactive(screen.getByRole("link", { name: "Send Resource" }));
  });
});
