import { describe, expect, it } from "vite-plus/test";

import { goalRowSchema } from "#/modules/goals/adapters/schemas/goal-row.schema";

const validRow = {
  id: "goal-1",
  user_id: "user-1",
  title: "Learn web pentesting",
  description: "Focus on OWASP Top 10",
  target_date: "2026-12-31",
  hours_per_week: 5,
  status: "active" as const,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("goalRowSchema", () => {
  it("accepts a valid goals row", () => {
    expect(goalRowSchema.parse(validRow)).toEqual(validRow);
  });

  it("accepts null description and target_date", () => {
    expect(
      goalRowSchema.parse({
        ...validRow,
        description: null,
        target_date: null,
      }),
    ).toEqual({
      ...validRow,
      description: null,
      target_date: null,
    });
  });

  it("rejects invalid status", () => {
    const result = goalRowSchema.safeParse({ ...validRow, status: "archived" });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive hours_per_week at schema level when number is invalid type", () => {
    const result = goalRowSchema.safeParse({ ...validRow, hours_per_week: "five" });
    expect(result.success).toBe(false);
  });
});
