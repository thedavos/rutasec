import { describe, expect, it } from "vite-plus/test";

import {
  formatResourceCount,
  levelLabel,
  resourceTypeLabel,
  userResourceStatusLabel,
} from "#/shared/i18n/resource-labels";

describe("resource-labels", () => {
  it("returns localized level and type labels", () => {
    expect(levelLabel("beginner")).toBe("Beginner");
    expect(resourceTypeLabel("documentation")).toBe("Docs");
  });

  it("returns localized user resource status labels", () => {
    expect(userResourceStatusLabel("in_progress")).toBe("In progress");
  });

  it("formats singular and plural resource counts", () => {
    expect(formatResourceCount(1)).toBe("1 resource");
    expect(formatResourceCount(3)).toBe("3 resources");
  });
});
