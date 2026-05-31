import { describe, expect, it } from "vite-plus/test";

import { parseSafeRedirectPath } from "#/shared/utils/safe-redirect-path";

describe("parseSafeRedirectPath", () => {
  it("accepts internal paths", () => {
    expect(parseSafeRedirectPath("/resources/abc")).toBe("/resources/abc");
  });

  it("rejects external and protocol-relative URLs", () => {
    expect(parseSafeRedirectPath("https://evil.test")).toBeUndefined();
    expect(parseSafeRedirectPath("//evil.test")).toBeUndefined();
  });

  it("rejects non-strings", () => {
    expect(parseSafeRedirectPath(null)).toBeUndefined();
  });
});
