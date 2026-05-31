import { describe, expect, it } from "vite-plus/test";

import { userResourceRowSchema } from "#/modules/library/adapters/schemas/user-resource-row.schema";

describe("userResourceRowSchema", () => {
  it("accepts a valid user_resources row", () => {
    const parsed = userResourceRowSchema.safeParse({
      id: "ur-1",
      user_id: "app-1",
      resource_id: "res-1",
      status: "pending",
      progress_percentage: 0,
      notes: null,
      started_at: null,
      completed_at: null,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid status and progress", () => {
    const parsed = userResourceRowSchema.safeParse({
      id: "ur-1",
      user_id: "app-1",
      resource_id: "res-1",
      status: "archived",
      progress_percentage: 150,
      notes: null,
      started_at: null,
      completed_at: null,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(parsed.success).toBe(false);
  });
});
