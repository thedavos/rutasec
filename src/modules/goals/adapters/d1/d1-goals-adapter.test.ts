import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { createD1GoalsAdapter } from "#/modules/goals/adapters/d1/d1-goals-adapter";

const validRow = {
  id: "goal-1",
  user_id: "app-1",
  title: "Learn web pentesting",
  description: "Focus on OWASP Top 10",
  target_date: "2026-12-31",
  hours_per_week: 5,
  status: "active",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

function createMockDb(options: {
  runError?: Error;
  row?: Record<string, unknown> | null;
  selectError?: Error;
  selectOnly?: boolean;
}) {
  let callIndex = 0;
  const prepare = vi.fn(() => {
    const index = callIndex++;
    if (options.selectOnly || index > 0) {
      const first = vi.fn(async () => {
        if (options.selectError) {
          throw options.selectError;
        }
        return options.row ?? null;
      });
      return { bind: vi.fn().mockReturnValue({ first }), first };
    }

    const run = vi.fn(async () => {
      if (options.runError) {
        throw options.runError;
      }
      return { success: true };
    });
    return { bind: vi.fn().mockReturnValue({ run }), run };
  });

  return { prepare };
}

function createListMockDb(rows: unknown[], options?: { allError?: Error }) {
  const prepare = vi.fn(() => ({
    bind: vi.fn().mockReturnValue({
      all: vi.fn(async () => {
        if (options?.allError) {
          throw options.allError;
        }
        return { results: rows };
      }),
    }),
  }));

  return { prepare };
}

describe("createD1GoalsAdapter", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValue("generated-id"),
    });
  });

  it("inserts and returns the mapped learning goal", async () => {
    const { prepare } = createMockDb({ row: validRow });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.createForUser({
      userId: "app-1",
      title: "Learn web pentesting",
      description: "Focus on OWASP Top 10",
      targetDate: "2026-12-31",
      hoursPerWeek: 5,
    });

    expect(result).toEqual({
      ok: true,
      value: {
        id: "goal-1",
        userId: "app-1",
        title: "Learn web pentesting",
        description: "Focus on OWASP Top 10",
        targetDate: "2026-12-31",
        hoursPerWeek: 5,
        status: "active",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    expect(prepare).toHaveBeenCalledTimes(2);
  });

  it("normalizes empty description and target date to null", async () => {
    const { prepare } = createMockDb({
      row: {
        ...validRow,
        description: null,
        target_date: null,
      },
    });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    await adapter.createForUser({
      userId: "app-1",
      title: "  Learn Linux  ",
      description: "   ",
      targetDate: "",
      hoursPerWeek: 3,
    });

    expect(prepare).toHaveBeenCalledTimes(2);
  });

  it("returns query_failed when insert throws", async () => {
    const { prepare } = createMockDb({ runError: new Error("insert failed") });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.createForUser({
      userId: "app-1",
      title: "Learn Linux",
      hoursPerWeek: 3,
    });

    expect(result).toEqual({
      ok: false,
      error: { type: "query_failed", message: "insert failed" },
    });
  });

  it("returns invalid_row when select returns no row after insert", async () => {
    const { prepare } = createMockDb({ row: null });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.createForUser({
      userId: "app-1",
      title: "Learn Linux",
      hoursPerWeek: 3,
    });

    expect(result).toEqual({
      ok: false,
      error: { type: "invalid_row", message: "goals row missing after insert" },
    });
  });

  it("returns invalid_row when select row fails validation", async () => {
    const { prepare } = createMockDb({ row: { id: "goal-1" } });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.createForUser({
      userId: "app-1",
      title: "Learn Linux",
      hoursPerWeek: 3,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe("invalid_row");
    }
  });

  it("listForUser returns mapped goals scoped to the user", async () => {
    const { prepare } = createListMockDb([validRow]);
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.listForUser("app-1");

    expect(result).toEqual({
      ok: true,
      value: [
        {
          id: "goal-1",
          userId: "app-1",
          title: "Learn web pentesting",
          description: "Focus on OWASP Top 10",
          targetDate: "2026-12-31",
          hoursPerWeek: 5,
          status: "active",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });
  });

  it("returns query_failed when list throws", async () => {
    const { prepare } = createListMockDb([], { allError: new Error("list failed") });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.listForUser("app-1");

    expect(result).toEqual({
      ok: false,
      error: { type: "query_failed", message: "list failed" },
    });
  });

  it("returns invalid_row when a list row fails validation", async () => {
    const { prepare } = createListMockDb([{ id: "goal-1" }]);
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.listForUser("app-1");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe("invalid_row");
    }
  });

  it("linkResource returns ok when insert succeeds", async () => {
    const prepare = vi.fn(() => ({
      bind: vi.fn().mockReturnValue({
        run: vi.fn(async () => ({ meta: { changes: 1 } })),
      }),
    }));
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.linkResource({
      userId: "app-1",
      goalId: "goal-1",
      resourceId: "res-1",
    });

    expect(result).toEqual({ ok: true, value: undefined });
  });

  it("linkResource returns ok when the relation already exists", async () => {
    let callIndex = 0;
    const prepare = vi.fn(() => {
      const index = callIndex++;
      if (index === 0) {
        return {
          bind: vi.fn().mockReturnValue({
            run: vi.fn(async () => ({ meta: { changes: 0 } })),
          }),
        };
      }
      return {
        bind: vi.fn().mockReturnValue({
          first: vi.fn(async () => ({ exists_flag: 1 })),
        }),
      };
    });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.linkResource({
      userId: "app-1",
      goalId: "goal-1",
      resourceId: "res-1",
    });

    expect(result).toEqual({ ok: true, value: undefined });
  });

  it("linkResource returns goal_not_found when the goal is not owned", async () => {
    let callIndex = 0;
    const prepare = vi.fn(() => {
      const index = callIndex++;
      if (index === 0) {
        return {
          bind: vi.fn().mockReturnValue({
            run: vi.fn(async () => ({ meta: { changes: 0 } })),
          }),
        };
      }
      if (index === 1) {
        return {
          bind: vi.fn().mockReturnValue({
            first: vi.fn(async () => null),
          }),
        };
      }
      return {
        bind: vi.fn().mockReturnValue({
          first: vi.fn(async () => null),
        }),
      };
    });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.linkResource({
      userId: "app-1",
      goalId: "goal-missing",
      resourceId: "res-1",
    });

    expect(result).toEqual({
      ok: false,
      error: { type: "goal_not_found", message: "Goal not found." },
    });
  });

  it("linkResource returns resource_not_in_library when resource is not saved", async () => {
    let callIndex = 0;
    const prepare = vi.fn(() => {
      const index = callIndex++;
      if (index === 0) {
        return {
          bind: vi.fn().mockReturnValue({
            run: vi.fn(async () => ({ meta: { changes: 0 } })),
          }),
        };
      }
      if (index === 1) {
        return {
          bind: vi.fn().mockReturnValue({
            first: vi.fn(async () => null),
          }),
        };
      }
      return {
        bind: vi.fn().mockReturnValue({
          first: vi.fn(async () => ({ exists_flag: 1 })),
        }),
      };
    });
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.linkResource({
      userId: "app-1",
      goalId: "goal-1",
      resourceId: "res-1",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        type: "resource_not_in_library",
        message: "Save this resource to your library before linking it to a goal.",
      },
    });
  });

  it("listLinkedResourcesForUser returns mapped links scoped to the user", async () => {
    const { prepare } = createListMockDb([
      {
        goal_id: "goal-1",
        resource_id: "res-1",
        priority: 0,
        linked_at: "2026-01-01T00:00:00.000Z",
        title: "Web Security",
        category: "Web",
        level: "beginner",
        resource_type: "course",
      },
    ]);
    const adapter = createD1GoalsAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.listLinkedResourcesForUser("app-1");

    expect(result).toEqual({
      ok: true,
      value: [
        {
          goalId: "goal-1",
          resourceId: "res-1",
          priority: 0,
          linkedAt: "2026-01-01T00:00:00.000Z",
          title: "Web Security",
          category: "Web",
          level: "beginner",
          resourceType: "course",
        },
      ],
    });
  });
});
