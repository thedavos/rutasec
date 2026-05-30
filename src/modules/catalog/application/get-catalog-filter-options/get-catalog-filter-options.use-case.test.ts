import { describe, expect, it, vi } from "vite-plus/test";

import { GetCatalogFilterOptionsUseCase } from "#/modules/catalog/application/get-catalog-filter-options/get-catalog-filter-options.use-case";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { err, ok } from "#/shared/domain/result";

describe("GetCatalogFilterOptionsUseCase", () => {
  it("returns filter options from the catalog port", async () => {
    const filterOptions = {
      categories: ["Networking"],
      levels: ["beginner" as const],
      resourceTypes: ["course" as const],
    };
    const getFilterOptions = vi.fn().mockResolvedValue(ok(filterOptions));
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions,
      getPublishedById: vi.fn(),
    };

    const useCase = new GetCatalogFilterOptionsUseCase(catalog);
    const result = await useCase.execute();

    expect(result).toEqual(ok(filterOptions));
    expect(getFilterOptions).toHaveBeenCalledOnce();
  });

  it("propagates port errors", async () => {
    const getFilterOptions = vi
      .fn()
      .mockResolvedValue(err({ type: "query_failed", message: "D1 down" }));
    const catalog: CatalogPort = {
      listPublished: vi.fn(),
      getFilterOptions,
      getPublishedById: vi.fn(),
    };

    const useCase = new GetCatalogFilterOptionsUseCase(catalog);
    const result = await useCase.execute();

    expect(result).toEqual(err({ type: "query_failed", message: "D1 down" }));
  });
});
