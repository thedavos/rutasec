import { describe, expect, it, vi } from "vite-plus/test";

import { ListCatalogResourcesUseCase } from "#/modules/catalog/application/list-catalog-resources/list-catalog-resources.use-case";
import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { err, ok } from "#/shared/domain/result";

const resource: CatalogResourceCard = {
  id: "res-1",
  title: "Linux Journey",
  description: null,
  url: "https://linuxjourney.com/",
  iconUrl: null,
  phase: "Foundational Knowledge Phase",
  category: "Networking",
  topic: "TCP/IP",
  subtopic: null,
  resourceType: "article",
  level: "intermediate",
  estimatedHours: 2,
  isFree: false,
  language: null,
  attribution: {
    originalSourceName: "Source",
    originalSourceUrl: "https://example.com/source",
    curatedFromName: "Roadmap",
    curatedFromUrl: "https://example.com/roadmap",
  },
};

describe("ListCatalogResourcesUseCase", () => {
  it("returns resources with parsed filters and total", async () => {
    const listPublished = vi.fn().mockResolvedValue(ok([resource]));
    const catalog: CatalogPort = {
      listPublished,
      getFilterOptions: vi.fn(),
      getPublishedById: vi.fn(),
    };

    const useCase = new ListCatalogResourcesUseCase(catalog);
    const result = await useCase.execute({ resourceType: "article" });

    expect(result).toEqual(
      ok({
        resources: [resource],
        total: 1,
        filters: { resourceType: "article" },
      }),
    );
    expect(listPublished).toHaveBeenCalledWith({ resourceType: "article" });
  });

  it("propagates listPublished errors", async () => {
    const listPublished = vi
      .fn()
      .mockResolvedValue(err({ type: "invalid_row", message: "bad data" }));
    const catalog: CatalogPort = {
      listPublished,
      getFilterOptions: vi.fn(),
      getPublishedById: vi.fn(),
    };

    const useCase = new ListCatalogResourcesUseCase(catalog);
    const result = await useCase.execute();

    expect(result).toEqual(err({ type: "invalid_row", message: "bad data" }));
  });
});
