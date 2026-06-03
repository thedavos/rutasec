import { describe, expect, it } from "vite-plus/test";

import { normalizeComparableUrl } from "#/shared/utils/normalize-comparable-url";

describe("normalizeComparableUrl", () => {
  it("normalizes host casing, www prefix, and trailing slashes", () => {
    expect(normalizeComparableUrl("HTTPS://WWW.Example.COM/path/")).toBe("example.com/path");
  });

  it("falls back to trimmed lowercase strings for invalid urls", () => {
    expect(normalizeComparableUrl("  not-a-valid-url/  ")).toBe("not-a-valid-url");
  });
});
