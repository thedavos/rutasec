import { buildListResourcesQuery } from "#/modules/catalog/adapters/d1/build-list-resources-query";
import { invalidRowError, mapD1Error } from "#/modules/catalog/adapters/errors/map-d1-error";
import { mapResourceRowToCard } from "#/modules/catalog/adapters/mappers/map-resource-row";
import {
  resourceRowListSchema,
  resourceRowSchema,
} from "#/modules/catalog/adapters/schemas/resource-row.schema";
import {
  RESOURCE_LEVELS,
  RESOURCE_TYPES,
  type CatalogFilterOptions,
  type CatalogFilters,
  type CatalogResourceCard,
  type ResourceLevel,
  type ResourceType,
} from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { err, ok, type Result } from "#/shared/domain/result";

async function queryDistinctValues(
  db: D1Database,
  column: "category" | "level" | "resource_type",
): Promise<Result<string[], CatalogError>> {
  try {
    const result = await db
      .prepare(
        `
      SELECT DISTINCT ${column} AS value
      FROM resources
      WHERE is_published = 1
      ORDER BY value ASC
    `.trim(),
      )
      .all<{ value: string }>();

    return ok(result.results.map((row) => row.value));
  } catch (error) {
    return err(mapD1Error(error));
  }
}

function parseResourceRows(rows: unknown[]): Result<CatalogResourceCard[], CatalogError> {
  const parsed = resourceRowListSchema.safeParse(rows);
  if (!parsed.success) {
    return err(invalidRowError(parsed.error.message));
  }
  return ok(parsed.data.map(mapResourceRowToCard));
}

export function createD1CatalogAdapter(db: D1Database): CatalogPort {
  return {
    async listPublished(
      filters: CatalogFilters,
    ): Promise<Result<CatalogResourceCard[], CatalogError>> {
      try {
        const { sql, bindings } = buildListResourcesQuery(filters);
        const statement = db.prepare(sql);

        const result =
          bindings.length > 0 ? await statement.bind(...bindings).all() : await statement.all();

        return parseResourceRows(result.results);
      } catch (error) {
        return err(mapD1Error(error));
      }
    },

    async getFilterOptions(): Promise<Result<CatalogFilterOptions, CatalogError>> {
      const [categoriesResult, levelsResult, resourceTypesResult] = await Promise.all([
        queryDistinctValues(db, "category"),
        queryDistinctValues(db, "level"),
        queryDistinctValues(db, "resource_type"),
      ]);

      if (!categoriesResult.ok) {
        return categoriesResult;
      }
      if (!levelsResult.ok) {
        return levelsResult;
      }
      if (!resourceTypesResult.ok) {
        return resourceTypesResult;
      }

      const levels = levelsResult.value.filter((level): level is ResourceLevel =>
        RESOURCE_LEVELS.includes(level as ResourceLevel),
      );
      const resourceTypes = resourceTypesResult.value.filter(
        (resourceType): resourceType is ResourceType =>
          RESOURCE_TYPES.includes(resourceType as ResourceType),
      );

      return ok({
        categories: categoriesResult.value,
        levels,
        resourceTypes,
      });
    },
  };
}

export function parseResourceRow(row: unknown): Result<CatalogResourceCard, CatalogError> {
  const parsed = resourceRowSchema.safeParse(row);
  if (!parsed.success) {
    return err(invalidRowError(parsed.error.message));
  }
  return ok(mapResourceRowToCard(parsed.data));
}
