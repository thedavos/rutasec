import { describe, expect, it } from "vite-plus/test";

import { goalLinkedResourceRowSchema } from "#/modules/goals/adapters/schemas/goal-linked-resource-row.schema";

describe("goalLinkedResourceRowSchema", () => {
  it("parses a joined goal_resources row", () => {
    const parsed = goalLinkedResourceRowSchema.safeParse({
      goal_id: "goal-1",
      resource_id: "res-1",
      priority: 0,
      linked_at: "2026-01-01T00:00:00.000Z",
      title: "Web Security",
      category: "Web",
      level: "beginner",
      resource_type: "course",
    });

    expect(parsed.success).toBe(true);
  });
});
