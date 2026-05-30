import { describe, expect, it, vi } from "vite-plus/test";

import { GetPublicResourceByIdUseCase } from "#/modules/catalog/application/get-public-resource-by-id/get-public-resource-by-id.use-case";
import type { CatalogResourceDetail } from "#/modules/catalog/domain/entities/resource";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { err, ok } from "#/shared/domain/result";

const detail: CatalogResourceDetail = {
  id: "res-1",
  title: "Linux Journey",
  description: "Learn Linux",
  url: "https://linuxjourney.com/",
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

describe("GetPublicResourceByIdUseCase", () => {
  it("returns the resource detail from the catalog port", async () => {
    const getPublishedById = vi.fn().mockResolvedValue(ok(detail));
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions: vi.fn(),
      getPublishedById,
    };

    const useCase = new GetPublicResourceByIdUseCase(catalog);
    const result = await useCase.execute("res-1");

    expect(result).toEqual(ok(detail));
    expect(getPublishedById).toHaveBeenCalledWith("res-1");
  });

  it("propagates not_found errors", async () => {
    const getPublishedById = vi.fn().mockResolvedValue(err({ type: "not_found" }));
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions: vi.fn(),
      getPublishedById,
    };

    const useCase = new GetPublicResourceByIdUseCase(catalog);
    const result = await useCase.execute("missing");

    expect(result).toEqual(err({ type: "not_found" }));
  });

  it("propagates query failures", async () => {
    const getPublishedById = vi
      .fn()
      .mockResolvedValue(err({ type: "query_failed", message: "D1 down" }));
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions: vi.fn(),
      getPublishedById,
    };

    const useCase = new GetPublicResourceByIdUseCase(catalog);
    const result = await useCase.execute("res-1");

    expect(result).toEqual(err({ type: "query_failed", message: "D1 down" }));
  });
});
