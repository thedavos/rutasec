import { describe, expect, it, vi } from "vite-plus/test";

import { EnsureAppUserUseCase } from "#/modules/identity/application/ensure-app-user/ensure-app-user.use-case";
import { ResolveAuthenticatedAppUserUseCase } from "#/modules/identity/application/resolve-authenticated-app-user/resolve-authenticated-app-user.use-case";
import type { AppUser } from "#/modules/identity/domain/entities/app-user";
import type { AppUserPort } from "#/modules/identity/domain/ports/app-user-port";
import type { SessionPort } from "#/modules/identity/domain/ports/session-port";
import { err, ok } from "#/shared/domain/result";

const headers = new Headers();
const snapshot = {
  authUserId: "auth-1",
  email: "user@example.com",
  displayName: "Test User",
};

const appUser: AppUser = {
  id: "app-1",
  authUserId: "auth-1",
  email: "user@example.com",
  displayName: "Test User",
  role: "user",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("ResolveAuthenticatedAppUserUseCase", () => {
  it("returns unauthorized when session is missing", async () => {
    const upsertFromAuthSnapshot = vi.fn();
    const sessions: SessionPort = {
      getAuthUserSnapshot: vi.fn().mockResolvedValue(null),
    };
    const appUsers: AppUserPort = { upsertFromAuthSnapshot };

    const useCase = new ResolveAuthenticatedAppUserUseCase(
      sessions,
      new EnsureAppUserUseCase(appUsers),
    );
    const result = await useCase.execute({ headers });

    expect(result).toEqual(err({ type: "unauthorized" }));
    expect(upsertFromAuthSnapshot).not.toHaveBeenCalled();
  });

  it("ensures app user when session is present", async () => {
    const upsertFromAuthSnapshot = vi.fn().mockResolvedValue(ok(appUser));
    const sessions: SessionPort = {
      getAuthUserSnapshot: vi.fn().mockResolvedValue(snapshot),
    };
    const appUsers: AppUserPort = { upsertFromAuthSnapshot };

    const useCase = new ResolveAuthenticatedAppUserUseCase(
      sessions,
      new EnsureAppUserUseCase(appUsers),
    );
    const result = await useCase.execute({ headers });

    expect(result).toEqual(ok(appUser));
    expect(upsertFromAuthSnapshot).toHaveBeenCalledWith(snapshot);
  });

  it("propagates ensure errors", async () => {
    const sessions: SessionPort = {
      getAuthUserSnapshot: vi.fn().mockResolvedValue(snapshot),
    };
    const appUsers: AppUserPort = {
      upsertFromAuthSnapshot: vi
        .fn()
        .mockResolvedValue(err({ type: "query_failed", message: "upsert failed" })),
    };

    const useCase = new ResolveAuthenticatedAppUserUseCase(
      sessions,
      new EnsureAppUserUseCase(appUsers),
    );
    const result = await useCase.execute({ headers });

    expect(result).toEqual(err({ type: "query_failed", message: "upsert failed" }));
  });
});
