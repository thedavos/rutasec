import { describe, expect, it } from "vite-plus/test";

import { truncateMetaDescription } from "#/shared/utils/truncate-meta-description";

describe("truncateMetaDescription", () => {
  it("returns trimmed text when within the limit", () => {
    expect(truncateMetaDescription("  Learn Linux basics  ")).toBe("Learn Linux basics");
  });

  it("truncates long descriptions with an ellipsis", () => {
    const longDescription = "a".repeat(170);

    expect(truncateMetaDescription(longDescription)).toHaveLength(160);
    expect(truncateMetaDescription(longDescription)?.endsWith("…")).toBe(true);
  });

  it("returns undefined for empty values", () => {
    expect(truncateMetaDescription(null)).toBeUndefined();
    expect(truncateMetaDescription("   ")).toBeUndefined();
  });
});
