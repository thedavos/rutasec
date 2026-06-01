import { describe, expect, it } from "vite-plus/test";

import { goalErrorMessage } from "#/modules/goals/domain/errors/goal-errors";

describe("goalErrorMessage", () => {
  it("returns messages for each goal error type", () => {
    expect(goalErrorMessage({ type: "invalid_row", message: "bad row" })).toBe("bad row");
    expect(goalErrorMessage({ type: "query_failed", message: "D1 down" })).toBe("D1 down");
    expect(goalErrorMessage({ type: "goal_not_found", message: "missing" })).toBe("missing");
    expect(
      goalErrorMessage({
        type: "resource_not_in_library",
        message: "not saved",
      }),
    ).toBe("not saved");
  });
});
