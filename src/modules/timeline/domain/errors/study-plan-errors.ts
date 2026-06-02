export type StudyPlanError =
  | { type: "invalid_row"; message: string }
  | { type: "query_failed"; message: string }
  | { type: "goal_not_found"; message: string }
  | { type: "invalid_hours_per_week" }
  | { type: "invalid_resource_level"; message: string };

export function studyPlanErrorMessage(error: StudyPlanError): string {
  switch (error.type) {
    case "invalid_row":
      return error.message;
    case "query_failed":
      return error.message;
    case "goal_not_found":
      return error.message;
    case "invalid_hours_per_week":
      return "Hours per week must be a positive number.";
    case "invalid_resource_level":
      return error.message;
  }
}
