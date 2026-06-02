import { describe, expect, it } from "vite-plus/test";

import {
  invalidHoursPerWeekError,
  timelineErrorMessage,
} from "#/modules/timeline/domain/errors/timeline-errors";

describe("timeline errors", () => {
  it("describes invalid hours per week", () => {
    expect(timelineErrorMessage(invalidHoursPerWeekError())).toBe(
      "Hours per week must be a positive number",
    );
  });
});
