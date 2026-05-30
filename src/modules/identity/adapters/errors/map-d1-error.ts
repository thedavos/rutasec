import type { IdentityError } from "#/modules/identity/domain/errors/identity-errors";

export function mapD1Error(error: unknown): IdentityError {
  const message = error instanceof Error ? error.message : "D1 query failed";
  return { type: "query_failed", message };
}

export function invalidRowError(message: string): IdentityError {
  return { type: "invalid_row", message };
}
