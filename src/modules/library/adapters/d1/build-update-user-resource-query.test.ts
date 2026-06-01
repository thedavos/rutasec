import { describe, expect, it } from "vite-plus/test";

import { buildUpdateUserResourceQuery } from "#/modules/library/adapters/d1/build-update-user-resource-query";

describe("buildUpdateUserResourceQuery", () => {
  it("updates status, progress, timestamps, and updated_at for the user resource row", () => {
    const { sql, bindings } = buildUpdateUserResourceQuery(
      "app-1",
      "res-linux-journey",
      "in_progress",
      50,
      "2026-05-01T00:00:00.000Z",
      null,
      "2026-06-01T12:00:00.000Z",
    );

    expect(sql).toContain("UPDATE user_resources");
    expect(sql).toContain("progress_percentage = ?");
    expect(sql).toContain("started_at = ?");
    expect(sql).toContain("completed_at = ?");
    expect(sql).toContain("WHERE user_id = ? AND resource_id = ?");
    expect(bindings).toEqual({
      status: "in_progress",
      progressPercentage: 50,
      startedAt: "2026-05-01T00:00:00.000Z",
      completedAt: null,
      updatedAt: "2026-06-01T12:00:00.000Z",
      userId: "app-1",
      resourceId: "res-linux-journey",
    });
  });
});
