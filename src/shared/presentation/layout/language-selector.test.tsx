// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { LanguageSelector } from "#/shared/presentation/layout/language-selector";

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

describe("LanguageSelector", () => {
  beforeEach(() => {
    setLocaleMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders English and Spanish options with the active locale marked", () => {
    render(<LanguageSelector />);

    expect(screen.getByRole("group", { name: "Language" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "en" }).getAttribute("aria-current")).toBe("true");
    expect(screen.getByRole("button", { name: "es" }).getAttribute("aria-current")).toBeNull();
  });

  it("persists a manual locale choice through setLocale", () => {
    render(<LanguageSelector />);

    fireEvent.click(screen.getByRole("button", { name: "es" }));

    expect(setLocaleMock).toHaveBeenCalledWith("es");
  });
});
