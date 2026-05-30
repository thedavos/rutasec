import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { createD1AppUserAdapter } from "#/modules/identity/adapters/d1/d1-app-user-adapter";

const snapshot = {
  authUserId: "auth-1",
  email: "user@example.com",
  displayName: "Test User",
};

const validRow = {
  id: "app-1",
  auth_user_id: "auth-1",
  email: "user@example.com",
  display_name: "Test User",
  role: "user",
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

describe("createD1AppUserAdapter", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValue("generated-id"),
    });
  });

  it("upserts and returns the mapped app user", async () => {
    const { prepare } = createMockDb({ row: validRow });
    const adapter = createD1AppUserAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.upsertFromAuthSnapshot(snapshot);

    expect(result).toEqual({
      ok: true,
      value: {
        id: "app-1",
        authUserId: "auth-1",
        email: "user@example.com",
        displayName: "Test User",
        role: "user",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    expect(prepare).toHaveBeenCalledTimes(2);
  });

  it("returns query_failed when upsert throws", async () => {
    const { prepare } = createMockDb({ runError: new Error("upsert failed") });
    const adapter = createD1AppUserAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.upsertFromAuthSnapshot(snapshot);

    expect(result).toEqual({
      ok: false,
      error: { type: "query_failed", message: "upsert failed" },
    });
    expect(prepare).toHaveBeenCalledTimes(1);
  });

  it("returns invalid_row when select returns no row", async () => {
    const { prepare } = createMockDb({ row: null });
    const adapter = createD1AppUserAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.upsertFromAuthSnapshot(snapshot);

    expect(result).toEqual({
      ok: false,
      error: { type: "invalid_row", message: "app_users row missing after upsert" },
    });
  });

  it("returns invalid_row when select row fails validation", async () => {
    const { prepare } = createMockDb({ row: { id: "app-1" } });
    const adapter = createD1AppUserAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.upsertFromAuthSnapshot(snapshot);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe("invalid_row");
    }
  });

  it("returns query_failed when select throws", async () => {
    const { prepare } = createMockDb({ selectError: new Error("select failed") });
    const adapter = createD1AppUserAdapter({ prepare } as unknown as D1Database);

    const result = await adapter.upsertFromAuthSnapshot(snapshot);

    expect(result).toEqual({
      ok: false,
      error: { type: "query_failed", message: "select failed" },
    });
  });
});
