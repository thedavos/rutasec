import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { createD1StudyPlanAdapter } from "#/modules/timeline/adapters/d1/d1-study-plan-adapter";

const planRow = {
  id: "plan-1",
  user_id: "user-1",
  goal_id: "goal-1",
  title: "Goal study plan",
  total_estimated_hours: 4,
  estimated_weeks: 1,
  status: "active",
  generated_by: "system",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const itemRow = {
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
};

function createReplaceMockDb() {
  let callIndex = 0;
  const prepare = vi.fn(() => {
    const index = callIndex++;
    if (index === 0) {
      return { bind: vi.fn().mockReturnValue({ run: vi.fn(async () => ({ success: true })) }) };
    }
    if (index === 1) {
      return { bind: vi.fn().mockReturnValue({ run: vi.fn(async () => ({ success: true })) }) };
    }
    if (index === 2) {
      return { bind: vi.fn().mockReturnValue({ run: vi.fn(async () => ({ success: true })) }) };
    }
    if (index === 3) {
      return {
        bind: vi.fn().mockReturnValue({
          first: vi.fn(async () => planRow),
        }),
      };
    }
    return {
      bind: vi.fn().mockReturnValue({
        all: vi.fn(async () => ({ results: [itemRow] })),
      }),
    };
  });

  return { prepare };
}

function createGetMockDb(row: Record<string, unknown> | null, items: unknown[] = []) {
  let callIndex = 0;
  const prepare = vi.fn(() => {
    const index = callIndex++;
    if (index === 0) {
      return {
        bind: vi.fn().mockReturnValue({
          first: vi.fn(async () => row),
        }),
      };
    }
    return {
      bind: vi.fn().mockReturnValue({
        all: vi.fn(async () => ({ results: items })),
      }),
    };
  });

  return { prepare };
}

describe("createD1StudyPlanAdapter", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValueOnce("plan-new").mockReturnValueOnce("item-new"),
    });
  });

  it("replaceGeneratedPlan deletes active plan, inserts plan and items, then reloads", async () => {
    const { prepare } = createReplaceMockDb();
    const adapter = createD1StudyPlanAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.replaceGeneratedPlan({
      userId: "user-1",
      goalId: "goal-1",
      title: "Goal study plan",
      draft: {
        goalId: "goal-1",
        totalEstimatedHours: 4,
        estimatedWeeks: 1,
        items: [
          {
            resourceId: "res-1",
            title: "Web Security",
            itemOrder: 1,
            weekNumber: 1,
            remainingHours: 4,
            status: "pending",
          },
        ],
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.goalId).toBe("goal-1");
      expect(result.value.items).toHaveLength(1);
    }
    expect(prepare).toHaveBeenCalled();
  });

  it("getActiveByGoalForUser returns null when no plan exists", async () => {
    const { prepare } = createGetMockDb(null);
    const adapter = createD1StudyPlanAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.getActiveByGoalForUser({
      userId: "user-1",
      goalId: "goal-1",
    });

    expect(result).toEqual({ ok: true, value: null });
  });

  it("getActiveByGoalForUser returns plan with ordered items", async () => {
    const { prepare } = createGetMockDb(planRow, [itemRow]);
    const adapter = createD1StudyPlanAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.getActiveByGoalForUser({
      userId: "user-1",
      goalId: "goal-1",
    });

    expect(result.ok).toBe(true);
    if (result.ok && result.value) {
      expect(result.value.id).toBe("plan-1");
      expect(result.value.items[0]?.resourceId).toBe("res-1");
    }
  });

  it("returns invalid_row when plan row fails validation after insert", async () => {
    let callIndex = 0;
    const prepare = vi.fn(() => {
      const index = callIndex++;
      if (index < 2) {
        return { bind: vi.fn().mockReturnValue({ run: vi.fn(async () => ({ success: true })) }) };
      }
      return {
        bind: vi.fn().mockReturnValue({
          first: vi.fn(async () => ({ id: "bad" })),
        }),
      };
    });
    const adapter = createD1StudyPlanAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.replaceGeneratedPlan({
      userId: "user-1",
      goalId: "goal-1",
      title: "Goal study plan",
      draft: {
        goalId: "goal-1",
        totalEstimatedHours: 0,
        estimatedWeeks: 0,
        items: [],
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe("invalid_row");
    }
  });
});
