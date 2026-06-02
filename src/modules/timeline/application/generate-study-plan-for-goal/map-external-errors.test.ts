import { describe, expect, it } from "vite-plus/test";

import {
  mapGoalErrorToStudyPlanError,
  mapLibraryErrorToStudyPlanError,
} from "#/modules/timeline/application/generate-study-plan-for-goal/map-external-errors";

describe("mapExternalErrors", () => {
  it("preserves goal_not_found", () => {
    expect(
      mapGoalErrorToStudyPlanError({ type: "goal_not_found", message: "Goal not found." }),
    ).toEqual({ type: "goal_not_found", message: "Goal not found." });
  });

  it("maps library errors to query_failed", () => {
    expect(mapLibraryErrorToStudyPlanError({ type: "resource_not_found" })).toEqual({
      type: "query_failed",
      message: "Resource not found",
    });
  });
});
