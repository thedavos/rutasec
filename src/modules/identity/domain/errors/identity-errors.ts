export type IdentityError =
  | { type: "unauthorized" }
  | { type: "invalid_row"; message: string }
  | { type: "query_failed"; message: string };

export function identityErrorMessage(error: IdentityError): string {
  switch (error.type) {
    case "unauthorized":
      return "Authentication required";
    case "invalid_row":
      return error.message;
    case "query_failed":
      return error.message;
  }
}

export function unauthorizedError(): IdentityError {
  return { type: "unauthorized" };
}
