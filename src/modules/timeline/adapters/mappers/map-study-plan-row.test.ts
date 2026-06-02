import { describe, expect, it } from "vite-plus/test";

import {
  mapStudyPlanItemRow,
  mapStudyPlanRow,
} from "#/modules/timeline/adapters/mappers/map-study-plan-row";

describe("mapStudyPlanRow", () => {
  it("maps snake_case plan and item rows to camelCase entities", () => {
    const plan = mapStudyPlanRow(
      {
        id: "plan-1",
        user_id: "user-1",
        goal_id: "goal-1",
        title: "Learn web pentesting study plan",
        total_estimated_hours: 12,
        estimated_weeks: 3,
        status: "active",
        generated_by: "system",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
      [
        mapStudyPlanItemRow({
          id: "item-1",
          study_plan_id: "plan-1",
          resource_id: "res-1",
          item_order: 1,
          week_number: 1,
          estimated_start_date: null,
          estimated_end_date: null,
          status: "pending",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        }),
      ],
    );

    expect(plan).toEqual({
      id: "plan-1",
      userId: "user-1",
      goalId: "goal-1",
      title: "Learn web pentesting study plan",
      totalEstimatedHours: 12,
      estimatedWeeks: 3,
      status: "active",
      generatedBy: "system",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      items: [
        {
          id: "item-1",
          studyPlanId: "plan-1",
          resourceId: "res-1",
          itemOrder: 1,
          weekNumber: 1,
          status: "pending",
          estimatedStartDate: null,
          estimatedEndDate: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });
  });
});
