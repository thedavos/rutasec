export type CatalogError =
  | { type: "invalid_row"; message: string }
  | { type: "query_failed"; message: string }
  | { type: "not_found" };

export function catalogErrorMessage(error: CatalogError): string {
  switch (error.type) {
    case "invalid_row":
      return error.message;
    case "query_failed":
      return error.message;
    case "not_found":
      return "Resource not found";
  }
}

export function notFoundError(): CatalogError {
  return { type: "not_found" };
}
