import { describe, expect, it, vi } from "vite-plus/test";

import { createMemoryCatalogCacheStore } from "#/modules/catalog/adapters/cache/memory-catalog-cache-store";

describe("createMemoryCatalogCacheStore", () => {
  it("returns null on cache miss", async () => {
    const store = createMemoryCatalogCacheStore(() => 0);

    await expect(store.get("missing")).resolves.toBeNull();
  });

  it("returns stored values before ttl expiry", async () => {
    let now = 0;
    const store = createMemoryCatalogCacheStore(() => now);

    await store.put("catalog:list:v1:{}", "[]", 300);
    now = 299_000;

    await expect(store.get("catalog:list:v1:{}")).resolves.toBe("[]");
  });

  it("expires values after ttl", async () => {
    let now = 0;
    const store = createMemoryCatalogCacheStore(() => now);

    await store.put("catalog:list:v1:{}", "[]", 300);
    now = 300_000;

    await expect(store.get("catalog:list:v1:{}")).resolves.toBeNull();
  });

  it("overwrites existing keys on put", async () => {
    const store = createMemoryCatalogCacheStore(() => 0);

    await store.put("catalog:filter-options:v1", "first", 300);
    await store.put("catalog:filter-options:v1", "second", 300);

    await expect(store.get("catalog:filter-options:v1")).resolves.toBe("second");
  });
});

describe("createMemoryCatalogCacheStore timers", () => {
  it("uses fake timers for expiry", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const store = createMemoryCatalogCacheStore();

    await store.put("catalog:detail:v1:res-1", "{}", 60);
    await expect(store.get("catalog:detail:v1:res-1")).resolves.toBe("{}");

    vi.advanceTimersByTime(60_000);
    await expect(store.get("catalog:detail:v1:res-1")).resolves.toBeNull();

    vi.useRealTimers();
  });
});
