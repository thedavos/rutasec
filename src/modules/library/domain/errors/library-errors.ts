export type LibraryError =
  | { type: "resource_not_found" }
  | { type: "user_resource_not_found" }
  | { type: "invalid_row"; message: string }
  | { type: "query_failed"; message: string };

export function libraryErrorMessage(error: LibraryError): string {
  switch (error.type) {
    case "resource_not_found":
      return "Resource not found";
    case "user_resource_not_found":
      return "Resource is not in your library";
    case "invalid_row":
      return error.message;
    case "query_failed":
      return error.message;
  }
}

export function resourceNotFoundError(): LibraryError {
  return { type: "resource_not_found" };
}

export function userResourceNotFoundError(): LibraryError {
  return { type: "user_resource_not_found" };
}
