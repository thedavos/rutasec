import { describe, expect, it, vi } from "vite-plus/test";

import { createCachedCatalogAdapter } from "#/modules/catalog/adapters/cache/cached-catalog-adapter";
import {
  buildFilterOptionsCacheKey,
  buildListPublishedCacheKey,
  buildResourceDetailCacheKey,
} from "#/modules/catalog/adapters/cache/build-catalog-cache-key";
import { createMemoryCatalogCacheStore } from "#/modules/catalog/adapters/cache/memory-catalog-cache-store";
import type {
  CatalogFilterOptions,
  CatalogResourceCard,
  CatalogResourceDetail,
} from "#/modules/catalog/domain/entities/resource";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { err, ok } from "#/shared/domain/result";

const resource: CatalogResourceCard = {
  id: "res-1",
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
  attribution: {
    originalSourceName: "Linux Journey",
    originalSourceUrl: "https://linuxjourney.com/",
    curatedFromName: "Cybersecurity-Mastery-Roadmap",
    curatedFromUrl: "https://github.com/Hamed233/Cybersecurity-Mastery-Roadmap",
  },
};

const filterOptions: CatalogFilterOptions = {
  categories: ["Operating Systems"],
  levels: ["beginner"],
  resourceTypes: ["course"],
};

const detail: CatalogResourceDetail = {
  ...resource,
  roadmapSection: "Foundational Knowledge Phase > Operating Systems",
  tags: ["linux"],
  pathContext: null,
};

function createInnerPort(overrides: Partial<CatalogPort> = {}) {
  const listPublished = vi.fn<CatalogPort["listPublished"]>().mockResolvedValue(ok([resource]));
  const getFilterOptions = vi
    .fn<CatalogPort["getFilterOptions"]>()
    .mockResolvedValue(ok(filterOptions));
  const getPublishedById = vi.fn<CatalogPort["getPublishedById"]>().mockResolvedValue(ok(detail));

  const port: CatalogPort = {
    listPublished: overrides.listPublished ?? listPublished,
    getFilterOptions: overrides.getFilterOptions ?? getFilterOptions,
    getPublishedById: overrides.getPublishedById ?? getPublishedById,
  };

  return { port, listPublished, getFilterOptions, getPublishedById };
}

describe("createCachedCatalogAdapter", () => {
  it("caches successful listPublished responses", async () => {
    let now = 0;
    const cache = createMemoryCatalogCacheStore(() => now);
    const { port, listPublished } = createInnerPort();
    const adapter = createCachedCatalogAdapter(port, cache, { ttlSeconds: 300 });

    const filters = { category: "Operating Systems" };
    const first = await adapter.listPublished(filters);
    const second = await adapter.listPublished(filters);

    expect(first).toEqual(ok([resource]));
    expect(second).toEqual(ok([resource]));
    expect(listPublished).toHaveBeenCalledTimes(1);
    await expect(cache.get(buildListPublishedCacheKey(filters))).resolves.toBe(
      JSON.stringify([resource]),
    );
  });

  it("caches successful filter options", async () => {
    const cache = createMemoryCatalogCacheStore(() => 0);
    const { port, getFilterOptions } = createInnerPort();
    const adapter = createCachedCatalogAdapter(port, cache, { ttlSeconds: 300 });

    await adapter.getFilterOptions();
    await adapter.getFilterOptions();

    expect(getFilterOptions).toHaveBeenCalledTimes(1);
    await expect(cache.get(buildFilterOptionsCacheKey())).resolves.toBe(
      JSON.stringify(filterOptions),
    );
  });

  it("caches successful resource detail reads", async () => {
    const cache = createMemoryCatalogCacheStore(() => 0);
    const { port, getPublishedById } = createInnerPort();
    const adapter = createCachedCatalogAdapter(port, cache, { ttlSeconds: 300 });

    await adapter.getPublishedById("res-1");
    await adapter.getPublishedById("res-1");

    expect(getPublishedById).toHaveBeenCalledTimes(1);
    await expect(cache.get(buildResourceDetailCacheKey("res-1"))).resolves.toBe(
      JSON.stringify(detail),
    );
  });

  it("refetches after cache expiry", async () => {
    let now = 0;
    const cache = createMemoryCatalogCacheStore(() => now);
    const { port, getFilterOptions } = createInnerPort();
    const adapter = createCachedCatalogAdapter(port, cache, { ttlSeconds: 60 });

    await adapter.getFilterOptions();
    now = 60_000;
    await adapter.getFilterOptions();

    expect(getFilterOptions).toHaveBeenCalledTimes(2);
  });

  it("does not cache query failures", async () => {
    const cache = createMemoryCatalogCacheStore(() => 0);
    const listPublished = vi
      .fn<CatalogPort["listPublished"]>()
      .mockResolvedValue(err({ type: "query_failed", message: "boom" }));
    const { port } = createInnerPort({ listPublished });
    const adapter = createCachedCatalogAdapter(port, cache, { ttlSeconds: 300 });

    const filters = { q: "linux" };
    await adapter.listPublished(filters);
    await adapter.listPublished(filters);

    expect(listPublished).toHaveBeenCalledTimes(2);
    await expect(cache.get(buildListPublishedCacheKey(filters))).resolves.toBeNull();
  });

  it("does not cache not_found detail responses", async () => {
    const cache = createMemoryCatalogCacheStore(() => 0);
    const getPublishedById = vi
      .fn<CatalogPort["getPublishedById"]>()
      .mockResolvedValue(err({ type: "not_found" }));
    const { port } = createInnerPort({ getPublishedById });
    const adapter = createCachedCatalogAdapter(port, cache, { ttlSeconds: 300 });

    await adapter.getPublishedById("missing");
    await adapter.getPublishedById("missing");

    expect(getPublishedById).toHaveBeenCalledTimes(2);
    await expect(cache.get(buildResourceDetailCacheKey("missing"))).resolves.toBeNull();
  });

  it("treats invalid cached payloads as a miss", async () => {
    const cache = createMemoryCatalogCacheStore(() => 0);
    const { port, listPublished } = createInnerPort();
    const adapter = createCachedCatalogAdapter(port, cache, { ttlSeconds: 300 });
    const filters = { category: "Operating Systems" };

    await cache.put(buildListPublishedCacheKey(filters), "{not-json", 300);
    const result = await adapter.listPublished(filters);

    expect(result).toEqual(ok([resource]));
    expect(listPublished).toHaveBeenCalledTimes(1);
  });
});
