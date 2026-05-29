import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";

export function mapD1Error(error: unknown): CatalogError {
  const message = error instanceof Error ? error.message : "D1 query failed";
  return { type: "query_failed", message };
}

export function invalidRowError(message: string): CatalogError {
  return { type: "invalid_row", message };
}
