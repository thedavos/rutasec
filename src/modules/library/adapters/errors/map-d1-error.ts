import type { LibraryError } from "#/modules/library/domain/errors/library-errors";

export function mapD1Error(error: unknown): LibraryError {
  const message = error instanceof Error ? error.message : "D1 query failed";
  return { type: "query_failed", message };
}

export function invalidRowError(message: string): LibraryError {
  return { type: "invalid_row", message };
}
