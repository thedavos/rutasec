import { describe, expect, it } from "vite-plus/test";

import { cn } from "#/shared/utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4", undefined, "text-sm")).toBe("py-1 px-4 text-sm");
  });
});
