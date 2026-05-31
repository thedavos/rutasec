export type LibraryError =
  | { type: "resource_not_found" }
  | { type: "invalid_row"; message: string }
  | { type: "query_failed"; message: string };

export function libraryErrorMessage(error: LibraryError): string {
  switch (error.type) {
    case "resource_not_found":
      return "Resource not found";
    case "invalid_row":
      return error.message;
    case "query_failed":
      return error.message;
  }
}

export function resourceNotFoundError(): LibraryError {
  return { type: "resource_not_found" };
}
