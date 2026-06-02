import { describe, expect, it } from "vite-plus/test";

import { studyPlanErrorMessage } from "#/modules/timeline/domain/errors/study-plan-errors";

describe("studyPlanErrorMessage", () => {
  it("returns a message for invalid hours per week", () => {
    expect(studyPlanErrorMessage({ type: "invalid_hours_per_week" })).toContain("positive");
  });

  it("returns messages for other error types", () => {
    expect(studyPlanErrorMessage({ type: "goal_not_found", message: "missing" })).toBe("missing");
    expect(studyPlanErrorMessage({ type: "query_failed", message: "D1 down" })).toBe("D1 down");
    expect(studyPlanErrorMessage({ type: "invalid_resource_level", message: "bad level" })).toBe(
      "bad level",
    );
  });
});
