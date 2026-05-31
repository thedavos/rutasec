import { describe, expect, it } from "vite-plus/test";

import { personalLibraryRowSchema } from "#/modules/library/adapters/schemas/personal-library-row.schema";

describe("personalLibraryRowSchema", () => {
  it("accepts a valid joined library row", () => {
    const parsed = personalLibraryRowSchema.safeParse({
      user_resource_id: "ur-1",
      resource_id: "res-linux-journey",
      status: "pending",
      progress_percentage: 0,
      saved_at: "2026-01-01T00:00:00.000Z",
      title: "Linux Journey",
      category: "Operating Systems",
      level: "beginner",
      resource_type: "course",
    });

    expect(parsed.success).toBe(true);
  });
});
