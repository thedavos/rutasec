import { describe, expect, it, vi } from "vite-plus/test";

import {
  createD1CatalogAdapter,
  parseResourceRow,
} from "#/modules/catalog/adapters/d1/d1-catalog-adapter";
import { err, ok } from "#/shared/domain/result";

const validRow = {
  id: "res-1",
  title: "Linux Journey",
  description: "Learn Linux",
  url: "https://linuxjourney.com/",
  icon_url: null,
  phase: "Foundational Knowledge Phase",
  category: "Operating Systems",
  topic: "Linux Basics",
  subtopic: "Linux Fundamentals",
  resource_type: "course",
  level: "beginner",
  estimated_hours: 6,
  is_free: 1,
  language: "en",
  original_source_name: "Linux Journey",
  original_source_url: "https://linuxjourney.com/",
  curated_from_name: "Cybersecurity-Mastery-Roadmap",
  curated_from_url: "https://github.com/Hamed233/Cybersecurity-Mastery-Roadmap",
};

const validDetailRow = {
  ...validRow,
  roadmap_section: "Foundational Knowledge Phase > Operating Systems",
  path_id: "path-1",
  path_slug: "web-pentesting-bug-bounty-starter",
  path_title: "Web Pentesting Starter Path",
  item_order: 1,
  path_total: 18,
};

function createDetailMockDb(options: {
  detailRow?: Record<string, unknown> | null;
  detailError?: Error;
  tagSlugs?: string[];
  tagError?: Error;
}) {
  let callIndex = 0;
  const prepare = vi.fn(() => {
    const index = callIndex++;
    if (index === 0) {
      const first = vi.fn(async () => {
        if (options.detailError) {
          throw options.detailError;
        }
        return options.detailRow ?? null;
      });
      return { bind: vi.fn().mockReturnValue({ first }), first };
    }

    const all = vi.fn(async () => {
      if (options.tagError) {
        throw options.tagError;
      }
      return { results: (options.tagSlugs ?? []).map((slug) => ({ slug })) };
    });
    return { bind: vi.fn().mockReturnValue({ all }), all };
  });

  return {
    db: { prepare } as unknown as D1Database,
    prepare,
  };
}

function createMockDb(options: {
  listResults?: unknown[];
  listError?: Error;
  distinctByColumn?: Partial<Record<"category" | "level" | "resource_type", string[]>>;
  distinctError?: Error;
}) {
  const prepare = vi.fn((sql: string) => {
    const isDistinct = sql.includes("DISTINCT");
    const column = isDistinct
      ? sql.includes("category")
        ? "category"
        : sql.includes("level")
          ? "level"
          : sql.includes("resource_type")
            ? "resource_type"
            : null
      : null;

    const all = vi.fn(async () => {
      if (options.distinctError && column) {
        throw options.distinctError;
      }
      if (options.listError && !column) {
        throw options.listError;
      }
      if (column) {
        const values = options.distinctByColumn?.[column] ?? [];
        return { results: values.map((value) => ({ value })) };
      }
      return { results: options.listResults ?? [] };
    });

    return {
      bind: vi.fn().mockReturnValue({ all }),
      all,
    };
  });

  return {
    db: { prepare } as unknown as D1Database,
    prepare,
  };
}

describe("createD1CatalogAdapter", () => {
  it("listPublished maps valid rows without bindings when filters are empty", async () => {
    const { db, prepare } = createMockDb({ listResults: [validRow] });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.listPublished({});

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0]?.resourceType).toBe("course");
      expect(result.value[0]?.isFree).toBe(true);
    }
    const statement = prepare.mock.results[0]?.value;
    expect(statement.bind).not.toHaveBeenCalled();
  });

  it("listPublished binds filter parameters", async () => {
    const { db, prepare } = createMockDb({ listResults: [validRow] });
    const adapter = createD1CatalogAdapter(db);

    await adapter.listPublished({ category: "Networking", level: "beginner" });

    const statement = prepare.mock.results[0]?.value;
    expect(statement.bind).toHaveBeenCalledWith("Networking", "beginner");
  });

  it("listPublished returns invalid_row when rows fail schema validation", async () => {
    const { db } = createMockDb({ listResults: [{ id: "bad-row" }] });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.listPublished({});

    expect(result).toEqual(err({ type: "invalid_row", message: expect.any(String) }));
  });

  it("listPublished returns query_failed when D1 throws", async () => {
    const { db } = createMockDb({ listError: new Error("D1 timeout") });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.listPublished({});

    expect(result).toEqual(err({ type: "query_failed", message: "D1 timeout" }));
  });

  it("getFilterOptions returns distinct values and filters unknown enums", async () => {
    const { db } = createMockDb({
      distinctByColumn: {
        category: ["Networking", "Operating Systems"],
        level: ["beginner", "expert"],
        resource_type: ["course", "podcast"],
      },
    });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.getFilterOptions();

    expect(result).toEqual(
      ok({
        categories: ["Networking", "Operating Systems"],
        levels: ["beginner"],
        resourceTypes: ["course"],
      }),
    );
  });

  it("getFilterOptions propagates query failures", async () => {
    const { db } = createMockDb({ distinctError: new Error("distinct failed") });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.getFilterOptions();

    expect(result).toEqual(err({ type: "query_failed", message: "distinct failed" }));
  });

  it("getPublishedById maps detail rows and tag slugs", async () => {
    const { db, prepare } = createDetailMockDb({
      detailRow: validDetailRow,
      tagSlugs: ["linux", "mixed"],
    });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.getPublishedById("res-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe("res-1");
      expect(result.value.attribution.originalSourceUrl).toBe("https://linuxjourney.com/");
      expect(result.value.pathContext?.itemOrder).toBe(1);
      expect(result.value.tags).toEqual(["linux", "mixed"]);
    }
    expect(prepare).toHaveBeenCalledTimes(2);
  });

  it("getPublishedById returns not_found when no row exists", async () => {
    const { db } = createDetailMockDb({ detailRow: null });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.getPublishedById("missing");

    expect(result).toEqual(err({ type: "not_found" }));
  });

  it("getPublishedById returns invalid_row when detail row fails validation", async () => {
    const { db } = createDetailMockDb({ detailRow: { id: "bad-row" } });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.getPublishedById("bad-row");

    expect(result).toEqual(err({ type: "invalid_row", message: expect.any(String) }));
  });

  it("getPublishedById returns query_failed when D1 throws", async () => {
    const { db } = createDetailMockDb({ detailError: new Error("detail failed") });
    const adapter = createD1CatalogAdapter(db);

    const result = await adapter.getPublishedById("res-1");

    expect(result).toEqual(err({ type: "query_failed", message: "detail failed" }));
  });
});

describe("parseResourceRow", () => {
  it("maps a valid row", () => {
    const result = parseResourceRow(validRow);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe("res-1");
    }
  });

  it("returns invalid_row for malformed input", () => {
    const result = parseResourceRow({ id: "bad" });

    expect(result).toEqual(err({ type: "invalid_row", message: expect.any(String) }));
  });
});
