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
}) {
  let callIndex = 0;
  const prepare = vi.fn(() => {
    const index = callIndex++;
    if (index === 0) {
      const run = vi.fn(async () => {
        if (options.runError) {
          throw options.runError;
        }
        return { success: true };
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
});
