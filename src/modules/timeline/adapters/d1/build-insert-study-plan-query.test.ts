import { describe, expect, it } from "vite-plus/test";

import { buildInsertStudyPlanQuery } from "#/modules/timeline/adapters/d1/build-insert-study-plan-query";

describe("buildInsertStudyPlanQuery", () => {
  it("inserts an active system-generated plan", () => {
    const query = buildInsertStudyPlanQuery(
      "plan-1",
      "user-1",
      "goal-1",
      "Goal study plan",
      10,
      2,
      "2026-01-01T00:00:00.000Z",
    );

    expect(query.sql).toContain("INSERT INTO study_plans");
    expect(query.sql).toContain("'active'");
    expect(query.sql).toContain("'system'");
    expect(query.bindings.totalEstimatedHours).toBe(10);
    expect(query.bindings.estimatedWeeks).toBe(2);
  });
});
