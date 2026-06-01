import { describe, expect, it, vi } from "vite-plus/test";

import { GetPublicCatalogUseCase } from "#/modules/catalog/application/get-public-catalog/get-public-catalog.use-case";
import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { err, ok } from "#/shared/domain/result";

const resource: CatalogResourceCard = {
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
  attribution: {
    originalSourceName: "Linux Journey",
    curatedFromName: "Cybersecurity-Mastery-Roadmap",
  },
};

const filterOptions = {
  categories: ["Operating Systems"],
  levels: ["beginner" as const],
  resourceTypes: ["course" as const],
};

describe("GetPublicCatalogUseCase", () => {
  it("returns resources, filters, and filter options", async () => {
    const listPublished = vi.fn().mockResolvedValue(ok([resource]));
    const getFilterOptions = vi.fn().mockResolvedValue(ok(filterOptions));
    const catalog: CatalogPort = {
      listPublished,
      getFilterOptions,
      getPublishedById: vi.fn(),
    };

    const useCase = new GetPublicCatalogUseCase(catalog);
    const result = await useCase.execute({ category: "  Operating Systems  ", level: "beginner" });

    expect(result).toEqual(
      ok({
        resources: [resource],
        total: 1,
        filters: { category: "Operating Systems", level: "beginner" },
        filterOptions,
      }),
    );
    expect(listPublished).toHaveBeenCalledWith({
      category: "Operating Systems",
      level: "beginner",
    });
  });

  it("passes search query to listPublished", async () => {
    const listPublished = vi.fn().mockResolvedValue(ok([resource]));
    const getFilterOptions = vi.fn().mockResolvedValue(ok(filterOptions));
    const catalog: CatalogPort = {
      listPublished,
      getFilterOptions,
      getPublishedById: vi.fn(),
    };

    const useCase = new GetPublicCatalogUseCase(catalog);
    const result = await useCase.execute({ q: "  linux  " });

    expect(result.ok).toBe(true);
    expect(listPublished).toHaveBeenCalledWith({ q: "linux" });
  });

  it("propagates listPublished errors", async () => {
    const listPublished = vi
      .fn()
      .mockResolvedValue(err({ type: "query_failed", message: "list failed" }));
    const getFilterOptions = vi.fn();
    const catalog: CatalogPort = {
      listPublished,
      getFilterOptions,
      getPublishedById: vi.fn(),
    };

    const useCase = new GetPublicCatalogUseCase(catalog);
    const result = await useCase.execute();

    expect(result).toEqual(err({ type: "query_failed", message: "list failed" }));
    expect(getFilterOptions).not.toHaveBeenCalled();
  });

  it("propagates getFilterOptions errors", async () => {
    const listPublished = vi.fn().mockResolvedValue(ok([resource]));
    const getFilterOptions = vi
      .fn()
      .mockResolvedValue(err({ type: "query_failed", message: "options failed" }));
    const catalog: CatalogPort = {
      listPublished,
      getFilterOptions,
      getPublishedById: vi.fn(),
    };

    const useCase = new GetPublicCatalogUseCase(catalog);
    const result = await useCase.execute();

    expect(result).toEqual(err({ type: "query_failed", message: "options failed" }));
  });
});
