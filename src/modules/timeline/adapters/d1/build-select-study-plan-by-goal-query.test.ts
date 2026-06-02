import { describe, expect, it } from "vite-plus/test";

import {
  buildSelectActiveStudyPlanByGoalQuery,
  buildSelectStudyPlanItemsQuery,
} from "#/modules/timeline/adapters/d1/build-select-study-plan-by-goal-query";

describe("buildSelectActiveStudyPlanByGoalQuery", () => {
  it("selects the active plan scoped to user and goal", () => {
    const query = buildSelectActiveStudyPlanByGoalQuery("user-1", "goal-1");

    expect(query.sql).toContain("FROM study_plans");
    expect(query.sql).toContain("status = 'active'");
    expect(query.bindings).toEqual({ userId: "user-1", goalId: "goal-1" });
  });
});

describe("buildSelectStudyPlanItemsQuery", () => {
  it("orders items by item_order", () => {
    const query = buildSelectStudyPlanItemsQuery("plan-1");

    expect(query.sql).toContain("FROM study_plan_items");
    expect(query.sql).toContain("ORDER BY item_order ASC");
    expect(query.bindings).toEqual({ studyPlanId: "plan-1" });
  });
});
