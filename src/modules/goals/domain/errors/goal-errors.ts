export type GoalError =
  | { type: "invalid_row"; message: string }
  | { type: "query_failed"; message: string };

export function goalErrorMessage(error: GoalError): string {
  switch (error.type) {
    case "invalid_row":
      return error.message;
    case "query_failed":
      return error.message;
  }
}
