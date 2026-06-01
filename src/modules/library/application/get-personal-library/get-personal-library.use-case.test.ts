import { describe, expect, it, vi } from "vite-plus/test";

import { GetPersonalLibraryUseCase } from "#/modules/library/application/get-personal-library/get-personal-library.use-case";
import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";
import type { LibraryPort } from "#/modules/library/domain/ports/library-port";
import { err, ok } from "#/shared/domain/result";

const item: PersonalLibraryItem = {
  userResourceId: "ur-1",
  resourceId: "res-1",
  status: "pending",
  progressPercentage: 0,
  savedAt: "2026-01-01T00:00:00.000Z",
  title: "Linux Journey",
  category: "OS",
  level: "beginner",
  resourceType: "course",
};

describe("GetPersonalLibraryUseCase", () => {
  it("returns library items for the user without mutating input", async () => {
    const listForUser = vi.fn().mockResolvedValue(ok([item]));
    const library: LibraryPort = {
      saveForUser: vi.fn(),
      getForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser,
    };
    const input = { userId: "app-1" };

    const useCase = new GetPersonalLibraryUseCase(library);
    const result = await useCase.execute(input);

    expect(result).toEqual(
      ok({
        items: [item],
        statusFilter: null,
      }),
    );
    expect(listForUser).toHaveBeenCalledWith({ userId: "app-1", status: undefined });
    expect(input).toEqual({ userId: "app-1" });
  });

  it("passes status filter to the port and echoes it in the result", async () => {
    const listForUser = vi.fn().mockResolvedValue(ok([]));
    const library: LibraryPort = {
      saveForUser: vi.fn(),
      getForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser,
    };

    const useCase = new GetPersonalLibraryUseCase(library);
    const result = await useCase.execute({ userId: "app-1", status: "in_progress" });

    expect(result).toEqual(
      ok({
        items: [],
        statusFilter: "in_progress",
      }),
    );
    expect(listForUser).toHaveBeenCalledWith({ userId: "app-1", status: "in_progress" });
  });

  it("propagates library port errors", async () => {
    const library: LibraryPort = {
      saveForUser: vi.fn(),
      getForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser: vi.fn().mockResolvedValue(err({ type: "query_failed", message: "D1 down" })),
    };

    const useCase = new GetPersonalLibraryUseCase(library);
    const result = await useCase.execute({ userId: "app-1" });

    expect(result).toEqual(err({ type: "query_failed", message: "D1 down" }));
  });
});
