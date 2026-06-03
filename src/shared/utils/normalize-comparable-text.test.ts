import { describe, expect, it } from "vite-plus/test";

import { normalizeComparableText } from "#/shared/utils/normalize-comparable-text";

describe("normalizeComparableText", () => {
  it("trims and lowercases text", () => {
    expect(normalizeComparableText("  Linux Journey  ")).toBe("linux journey");
  });
});
