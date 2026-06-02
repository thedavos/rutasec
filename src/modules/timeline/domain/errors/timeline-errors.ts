export type TimelineError = { type: "invalid_hours_per_week" };

export function invalidHoursPerWeekError(): TimelineError {
  return { type: "invalid_hours_per_week" };
}

export function timelineErrorMessage(error: TimelineError): string {
  switch (error.type) {
    case "invalid_hours_per_week":
      return "Hours per week must be a positive number";
  }
}
