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
  curated_from_name: "Cybersecurity-Mastery-Roadmap",
};

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
