export type CatalogError =
  | { type: "invalid_row"; message: string }
  | { type: "query_failed"; message: string };

export function catalogErrorMessage(error: CatalogError): string {
  switch (error.type) {
    case "invalid_row":
      return error.message;
    case "query_failed":
      return error.message;
  }
}
