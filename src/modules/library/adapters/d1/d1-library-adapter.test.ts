import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { createD1LibraryAdapter } from "#/modules/library/adapters/d1/d1-library-adapter";

const validRow = {
  id: "ur-1",
  user_id: "app-1",
  resource_id: "res-linux-journey",
  status: "pending",
  progress_percentage: 0,
  notes: null,
  started_at: null,
  completed_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

function createMockDb(options: {
  runError?: Error;
  row?: Record<string, unknown> | null;
  selectError?: Error;
  selectOnly?: boolean;
  changes?: number;
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

    if (index === 0) {
      const run = vi.fn(async () => {
        if (options.runError) {
          throw options.runError;
        }
        return { success: true, meta: { changes: options.changes ?? 1 } };
      });
      return { bind: vi.fn().mockReturnValue({ run }), run };
    }

    const first = vi.fn(async () => {
      if (options.selectError) {
        throw options.selectError;
      }
      return options.row ?? null;
    });
    return { bind: vi.fn().mockReturnValue({ first }), first };
  });

  return { prepare };
}

describe("createD1LibraryAdapter", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValue("generated-id"),
    });
  });

  it("inserts and returns the mapped saved user resource", async () => {
    const { prepare } = createMockDb({ row: validRow });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.saveForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result).toEqual({
      ok: true,
      value: {
        id: "ur-1",
        userId: "app-1",
        resourceId: "res-linux-journey",
        status: "pending",
        progressPercentage: 0,
        notes: null,
        startedAt: null,
        completedAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    expect(prepare).toHaveBeenCalledTimes(2);
  });

  it("returns query_failed when insert throws", async () => {
    const { prepare } = createMockDb({ runError: new Error("insert failed") });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.saveForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result).toEqual({
      ok: false,
      error: { type: "query_failed", message: "insert failed" },
    });
    expect(prepare).toHaveBeenCalledTimes(1);
  });

  it("returns invalid_row when select returns no row", async () => {
    const { prepare } = createMockDb({ row: null });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.saveForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result).toEqual({
      ok: false,
      error: { type: "invalid_row", message: "user_resources row missing after save" },
    });
  });

  it("returns invalid_row when select row fails validation", async () => {
    const { prepare } = createMockDb({ row: { id: "ur-1" } });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.saveForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe("invalid_row");
    }
  });

  it("returns query_failed when select throws", async () => {
    const { prepare } = createMockDb({ selectError: new Error("select failed") });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.saveForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result).toEqual({
      ok: false,
      error: { type: "query_failed", message: "select failed" },
    });
  });

  it("getForUser returns the mapped row when present", async () => {
    const { prepare } = createMockDb({ row: validRow, selectOnly: true });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.getForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value?.resourceId).toBe("res-linux-journey");
    }
    expect(prepare).toHaveBeenCalledTimes(1);
  });

  it("getForUser returns null when no row exists", async () => {
    const { prepare } = createMockDb({ row: null, selectOnly: true });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.getForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result).toEqual({ ok: true, value: null });
  });
});

const updatedRow = {
  ...validRow,
  status: "in_progress",
  progress_percentage: 50,
  started_at: "2026-06-01T12:00:00.000Z",
  updated_at: "2026-06-01T12:00:00.000Z",
};

describe("createD1LibraryAdapter updateForUser", () => {
  it("updates and returns the mapped user resource", async () => {
    const { prepare } = createMockDb({ row: updatedRow });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.updateForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
      status: "in_progress",
      progressPercentage: 50,
      startedAt: "2026-06-01T12:00:00.000Z",
      completedAt: null,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe("in_progress");
      expect(result.value.progressPercentage).toBe(50);
    }
    expect(prepare).toHaveBeenCalledTimes(2);
  });

  it("returns user_resource_not_found when no row is updated", async () => {
    const { prepare } = createMockDb({ changes: 0 });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.updateForUser({
      userId: "app-1",
      resourceId: "missing",
      status: "pending",
      progressPercentage: 0,
      startedAt: null,
      completedAt: null,
    });

    expect(result).toEqual({
      ok: false,
      error: { type: "user_resource_not_found" },
    });
    expect(prepare).toHaveBeenCalledTimes(1);
  });

  it("returns query_failed when update throws", async () => {
    const { prepare } = createMockDb({ runError: new Error("update failed") });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.updateForUser({
      userId: "app-1",
      resourceId: "res-linux-journey",
      status: "completed",
      progressPercentage: 100,
      startedAt: "2026-06-01T12:00:00.000Z",
      completedAt: "2026-06-01T12:00:00.000Z",
    });

    expect(result).toEqual({
      ok: false,
      error: { type: "query_failed", message: "update failed" },
    });
  });
});

const listRow = {
  user_resource_id: "ur-1",
  resource_id: "res-linux-journey",
  status: "pending",
  progress_percentage: 0,
  saved_at: "2026-01-01T00:00:00.000Z",
  title: "Linux Journey",
  category: "Operating Systems",
  level: "beginner",
  resource_type: "course",
  estimated_hours: 4,
};

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

describe("createD1LibraryAdapter listForUser", () => {
  it("returns mapped library items scoped to the user", async () => {
    const { prepare } = createListMockDb([listRow]);
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.listForUser({ userId: "app-1" });

    expect(result).toEqual({
      ok: true,
      value: [
        {
          userResourceId: "ur-1",
          resourceId: "res-linux-journey",
          status: "pending",
          progressPercentage: 0,
          savedAt: "2026-01-01T00:00:00.000Z",
          title: "Linux Journey",
          category: "Operating Systems",
          level: "beginner",
          resourceType: "course",
          estimatedHours: 4,
        },
      ],
    });
    expect(prepare).toHaveBeenCalledTimes(1);
  });

  it("binds status when filtering", async () => {
    const bind = vi.fn().mockReturnValue({
      all: vi.fn().mockResolvedValue({ results: [] }),
    });
    const prepare = vi.fn(() => ({ bind }));
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    await adapter.listForUser({ userId: "app-1", status: "completed" });

    expect(bind).toHaveBeenCalledWith("app-1", "completed");
  });

  it("returns query_failed when list throws", async () => {
    const { prepare } = createListMockDb([], { allError: new Error("list failed") });
    const adapter = createD1LibraryAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.listForUser({ userId: "app-1" });

    expect(result).toEqual({
      ok: false,
      error: { type: "query_failed", message: "list failed" },
    });
  });
});
