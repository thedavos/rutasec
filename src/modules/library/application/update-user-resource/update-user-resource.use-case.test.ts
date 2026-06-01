import { describe, expect, it, vi } from "vite-plus/test";

import { UpdateUserResourceUseCase } from "#/modules/library/application/update-user-resource/update-user-resource.use-case";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryPort } from "#/modules/library/domain/ports/library-port";
import { err, ok } from "#/shared/domain/result";

const saved: SavedUserResource = {
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
};

const updated: SavedUserResource = {
  ...saved,
  status: "in_progress",
  progressPercentage: 25,
  startedAt: "2026-06-01T12:00:00.000Z",
  updatedAt: "2026-06-01T12:00:00.000Z",
};

describe("UpdateUserResourceUseCase", () => {
  it("loads the saved row, applies status rules, and updates via the port", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T12:00:00.000Z"));

    const getForUser = vi.fn().mockResolvedValue(ok(saved));
    const updateForUser = vi.fn().mockResolvedValue(ok(updated));
    const library: LibraryPort = {
      saveForUser: vi.fn(),
      getForUser,
      updateForUser,
      listForUser: vi.fn(),
    };

    const useCase = new UpdateUserResourceUseCase(library);
    const result = await useCase.execute({
      userId: "app-1",
      resourceId: "res-linux-journey",
      status: "in_progress",
      progressPercentage: 25,
    });

    expect(result).toEqual(ok(updated));
    expect(updateForUser).toHaveBeenCalledWith({
      userId: "app-1",
      resourceId: "res-linux-journey",
      status: "in_progress",
      progressPercentage: 25,
      startedAt: "2026-06-01T12:00:00.000Z",
      completedAt: null,
    });

    vi.useRealTimers();
  });

  it("returns user_resource_not_found when the resource is not saved", async () => {
    const updateForUser = vi.fn();
    const library: LibraryPort = {
      saveForUser: vi.fn(),
      getForUser: vi.fn().mockResolvedValue(ok(null)),
      updateForUser,
      listForUser: vi.fn(),
    };

    const useCase = new UpdateUserResourceUseCase(library);
    const result = await useCase.execute({
      userId: "app-1",
      resourceId: "res-linux-journey",
      status: "in_progress",
      progressPercentage: 10,
    });

    expect(result).toEqual(err({ type: "user_resource_not_found" }));
    expect(updateForUser).not.toHaveBeenCalled();
  });

  it("propagates getForUser errors", async () => {
    const library: LibraryPort = {
      saveForUser: vi.fn(),
      getForUser: vi.fn().mockResolvedValue(err({ type: "query_failed", message: "read failed" })),
      updateForUser: vi.fn(),
      listForUser: vi.fn(),
    };

    const useCase = new UpdateUserResourceUseCase(library);
    const result = await useCase.execute({
      userId: "app-1",
      resourceId: "res-linux-journey",
      status: "completed",
      progressPercentage: 100,
    });

    expect(result).toEqual(err({ type: "query_failed", message: "read failed" }));
  });

  it("propagates updateForUser errors", async () => {
    const library: LibraryPort = {
      saveForUser: vi.fn(),
      getForUser: vi.fn().mockResolvedValue(ok(saved)),
      updateForUser: vi
        .fn()
        .mockResolvedValue(err({ type: "query_failed", message: "update failed" })),
      listForUser: vi.fn(),
    };

    const useCase = new UpdateUserResourceUseCase(library);
    const result = await useCase.execute({
      userId: "app-1",
      resourceId: "res-linux-journey",
      status: "completed",
      progressPercentage: 100,
    });

    expect(result).toEqual(err({ type: "query_failed", message: "update failed" }));
  });
});
