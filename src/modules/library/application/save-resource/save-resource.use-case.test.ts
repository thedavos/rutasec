import { describe, expect, it, vi } from "vite-plus/test";

import { SaveResourceUseCase } from "#/modules/library/application/save-resource/save-resource.use-case";
import type { CatalogResourceDetail } from "#/modules/catalog/domain/entities/resource";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryPort } from "#/modules/library/domain/ports/library-port";
import { err, ok } from "#/shared/domain/result";

const detail: CatalogResourceDetail = {
  id: "res-linux-journey",
  title: "Linux Journey",
  description: "Learn Linux",
  url: "https://linuxjourney.com/",
  iconUrl: null,
  phase: "Foundational Knowledge Phase",
  category: "Operating Systems",
  topic: "Linux Basics",
  subtopic: null,
  resourceType: "course",
  level: "beginner",
  estimatedHours: 6,
  isFree: true,
  language: "en",
  roadmapSection: "Foundational Knowledge Phase > Operating Systems",
  attribution: {
    originalSourceName: "Linux Journey",
    originalSourceUrl: "https://linuxjourney.com/",
    curatedFromName: "Cybersecurity-Mastery-Roadmap",
    curatedFromUrl: "https://github.com/Hamed233/Cybersecurity-Mastery-Roadmap",
  },
  tags: ["mixed", "linux"],
  pathContext: {
    pathId: "path-1",
    pathSlug: "starter",
    pathTitle: "Starter Path",
    itemOrder: 1,
    totalItems: 18,
  },
};

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

describe("SaveResourceUseCase", () => {
  it("verifies the resource is published then saves for the user", async () => {
    const getPublishedById = vi.fn().mockResolvedValue(ok(detail));
    const saveForUser = vi.fn().mockResolvedValue(ok(saved));
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions: vi.fn(),
      getPublishedById,
    };
    const library: LibraryPort = {
      saveForUser,
      getForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser: vi.fn(),
    };

    const useCase = new SaveResourceUseCase(library, catalog);
    const result = await useCase.execute({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result).toEqual(ok(saved));
    expect(getPublishedById).toHaveBeenCalledWith("res-linux-journey");
    expect(saveForUser).toHaveBeenCalledWith({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });
  });

  it("returns resource_not_found when the catalog has no published resource", async () => {
    const getPublishedById = vi.fn().mockResolvedValue(err({ type: "not_found" }));
    const saveForUser = vi.fn();
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions: vi.fn(),
      getPublishedById,
    };
    const library: LibraryPort = {
      saveForUser,
      getForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser: vi.fn(),
    };

    const useCase = new SaveResourceUseCase(library, catalog);
    const result = await useCase.execute({
      userId: "app-1",
      resourceId: "missing",
    });

    expect(result).toEqual(err({ type: "resource_not_found" }));
    expect(saveForUser).not.toHaveBeenCalled();
  });

  it("propagates catalog query failures", async () => {
    const getPublishedById = vi
      .fn()
      .mockResolvedValue(err({ type: "query_failed", message: "D1 down" }));
    const saveForUser = vi.fn();
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions: vi.fn(),
      getPublishedById,
    };
    const library: LibraryPort = {
      saveForUser,
      getForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser: vi.fn(),
    };

    const useCase = new SaveResourceUseCase(library, catalog);
    const result = await useCase.execute({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result).toEqual(err({ type: "query_failed", message: "D1 down" }));
    expect(saveForUser).not.toHaveBeenCalled();
  });

  it("propagates library port errors", async () => {
    const getPublishedById = vi.fn().mockResolvedValue(ok(detail));
    const saveForUser = vi
      .fn()
      .mockResolvedValue(err({ type: "query_failed", message: "insert failed" }));
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions: vi.fn(),
      getPublishedById,
    };
    const library: LibraryPort = {
      saveForUser,
      getForUser: vi.fn(),
      updateForUser: vi.fn(),
      listForUser: vi.fn(),
    };

    const useCase = new SaveResourceUseCase(library, catalog);
    const result = await useCase.execute({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });

    expect(result).toEqual(err({ type: "query_failed", message: "insert failed" }));
  });
});
