import { describe, expect, it, vi } from "vite-plus/test";

import { GetUserResourceUseCase } from "#/modules/library/application/get-user-resource/get-user-resource.use-case";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryPort } from "#/modules/library/domain/ports/library-port";
import { ok } from "#/shared/domain/result";

const saved: SavedUserResource = {
  id: "ur-1",
  userId: "app-1",
  resourceId: "res-1",
  status: "pending",
  progressPercentage: 0,
  notes: null,
  startedAt: null,
  completedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("GetUserResourceUseCase", () => {
  it("returns the user resource when the port finds a row", async () => {
    const getForUser = vi.fn().mockResolvedValue(ok(saved));
    const library: LibraryPort = {
      getForUser,
      saveForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser: vi.fn(),
    };

    const useCase = new GetUserResourceUseCase(library);
    const result = await useCase.execute({ userId: "app-1", resourceId: "res-1" });

    expect(result).toEqual(ok(saved));
    expect(getForUser).toHaveBeenCalledWith({ userId: "app-1", resourceId: "res-1" });
  });

  it("returns null when the port finds no row", async () => {
    const getForUser = vi.fn().mockResolvedValue(ok(null));
    const library: LibraryPort = {
      getForUser,
      saveForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser: vi.fn(),
    };

    const useCase = new GetUserResourceUseCase(library);
    const result = await useCase.execute({ userId: "app-1", resourceId: "res-1" });

    expect(result).toEqual(ok(null));
  });
});
