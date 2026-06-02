import { describe, expect, it } from "vite-plus/test";

import { buildDeleteActiveStudyPlanQuery } from "#/modules/timeline/adapters/d1/build-delete-active-study-plan-query";

describe("buildDeleteActiveStudyPlanQuery", () => {
  it("deletes only active plans for the user and goal", () => {
    const query = buildDeleteActiveStudyPlanQuery("user-1", "goal-1");

    expect(query.sql).toContain("DELETE FROM study_plans");
    expect(query.sql).toContain("status = 'active'");
    expect(query.bindings).toEqual({ userId: "user-1", goalId: "goal-1" });
  });
});
