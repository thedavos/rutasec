import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { createBetterAuthSessionAdapter } from "#/modules/identity/adapters/better-auth/better-auth-session-adapter";
import { getAuth } from "#/modules/identity/adapters/better-auth/server-auth";

vi.mock("#/modules/identity/adapters/better-auth/server-auth", () => ({
  getAuth: vi.fn(),
}));

describe("createBetterAuthSessionAdapter", () => {
  beforeEach(() => {
    vi.mocked(getAuth).mockReset();
  });

  it("returns null when session is missing", async () => {
    vi.mocked(getAuth).mockReturnValue({
      api: {
        getSession: vi.fn().mockResolvedValue(null),
      },
    } as never);

    const adapter = createBetterAuthSessionAdapter();
    const result = await adapter.getAuthUserSnapshot(new Headers());

    expect(result).toBeNull();
  });

  it("maps session user to AuthUserSnapshot", async () => {
    vi.mocked(getAuth).mockReturnValue({
      api: {
        getSession: vi.fn().mockResolvedValue({
          user: {
            id: "auth-1",
            email: "user@example.com",
            name: "Test User",
          },
        }),
      },
    } as never);

    const headers = new Headers({ cookie: "session=abc" });
    const adapter = createBetterAuthSessionAdapter();
    const result = await adapter.getAuthUserSnapshot(headers);

    expect(result).toEqual({
      authUserId: "auth-1",
      email: "user@example.com",
      displayName: "Test User",
    });
    expect(getAuth().api.getSession).toHaveBeenCalledWith({ headers });
  });

  it("maps missing name to null displayName", async () => {
    vi.mocked(getAuth).mockReturnValue({
      api: {
        getSession: vi.fn().mockResolvedValue({
          user: {
            id: "auth-1",
            email: "user@example.com",
          },
        }),
      },
    } as never);

    const adapter = createBetterAuthSessionAdapter();
    const result = await adapter.getAuthUserSnapshot(new Headers());

    expect(result?.displayName).toBeNull();
  });
});
