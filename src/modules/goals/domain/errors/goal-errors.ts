export type GoalError =
  | { type: "invalid_row"; message: string }
  | { type: "query_failed"; message: string }
  | { type: "goal_not_found"; message: string }
  | { type: "resource_not_in_library"; message: string };

export function goalErrorMessage(error: GoalError): string {
  switch (error.type) {
    case "invalid_row":
      return error.message;
    case "query_failed":
      return error.message;
    case "goal_not_found":
      return error.message;
    case "resource_not_in_library":
      return error.message;
  }
}
