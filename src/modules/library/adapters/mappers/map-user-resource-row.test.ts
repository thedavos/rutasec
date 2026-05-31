import { describe, expect, it } from "vite-plus/test";

import { mapUserResourceRow } from "#/modules/library/adapters/mappers/map-user-resource-row";

describe("mapUserResourceRow", () => {
  it("maps snake_case rows to camelCase saved user resource", () => {
    expect(
      mapUserResourceRow({
        id: "ur-1",
        user_id: "app-1",
        resource_id: "res-linux-journey",
        status: "in_progress",
        progress_percentage: 25,
        notes: "Started basics",
        started_at: "2026-02-01T00:00:00.000Z",
        completed_at: null,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-02-01T00:00:00.000Z",
      }),
    ).toEqual({
      id: "ur-1",
      userId: "app-1",
      resourceId: "res-linux-journey",
      status: "in_progress",
      progressPercentage: 25,
      notes: "Started basics",
      startedAt: "2026-02-01T00:00:00.000Z",
      completedAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
    });
  });
});
