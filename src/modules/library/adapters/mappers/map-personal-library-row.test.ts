import { describe, expect, it } from "vite-plus/test";

import { mapPersonalLibraryRowToItem } from "#/modules/library/adapters/mappers/map-personal-library-row";

describe("mapPersonalLibraryRowToItem", () => {
  it("maps snake_case join rows to camelCase library items", () => {
    expect(
      mapPersonalLibraryRowToItem({
        user_resource_id: "ur-1",
        resource_id: "res-linux-journey",
        status: "completed",
        progress_percentage: 100,
        saved_at: "2026-01-01T00:00:00.000Z",
        title: "Linux Journey",
        category: "Operating Systems",
        level: "intermediate",
        resource_type: "lab",
        estimated_hours: 6,
      }),
    ).toEqual({
      userResourceId: "ur-1",
      resourceId: "res-linux-journey",
      status: "completed",
      progressPercentage: 100,
      savedAt: "2026-01-01T00:00:00.000Z",
      title: "Linux Journey",
      category: "Operating Systems",
      level: "intermediate",
      resourceType: "lab",
      estimatedHours: 6,
    });
  });
});
