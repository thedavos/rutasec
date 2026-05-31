import { describe, expect, it, vi } from "vite-plus/test";

import { EnsureAppUserUseCase } from "#/modules/identity/application/ensure-app-user/ensure-app-user.use-case";
import type { AppUser } from "#/modules/identity/domain/entities/app-user";
import type { AppUserPort } from "#/modules/identity/domain/ports/app-user-port";
import { err, ok } from "#/shared/domain/result";

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

describe("EnsureAppUserUseCase", () => {
  it("delegates upsert to AppUserPort", async () => {
    const upsertFromAuthSnapshot = vi.fn().mockResolvedValue(ok(appUser));
    const appUsers: AppUserPort = { upsertFromAuthSnapshot };

    const useCase = new EnsureAppUserUseCase(appUsers);
    const result = await useCase.execute(snapshot);

    expect(result).toEqual(ok(appUser));
    expect(upsertFromAuthSnapshot).toHaveBeenCalledWith(snapshot);
  });

  it("propagates port errors", async () => {
    const upsertFromAuthSnapshot = vi
      .fn()
      .mockResolvedValue(err({ type: "query_failed", message: "upsert failed" }));
    const appUsers: AppUserPort = { upsertFromAuthSnapshot };

    const useCase = new EnsureAppUserUseCase(appUsers);
    const result = await useCase.execute(snapshot);

    expect(result).toEqual(err({ type: "query_failed", message: "upsert failed" }));
  });
});
