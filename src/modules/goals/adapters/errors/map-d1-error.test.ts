import { describe, expect, it } from "vite-plus/test";

import { invalidRowError, mapD1Error } from "#/modules/goals/adapters/errors/map-d1-error";

describe("mapD1Error", () => {
  it("maps Error instances to query_failed", () => {
    expect(mapD1Error(new Error("insert failed"))).toEqual({
      type: "query_failed",
      message: "insert failed",
    });
  });

  it("maps unknown values to a generic query_failed message", () => {
    expect(mapD1Error("boom")).toEqual({
      type: "query_failed",
      message: "D1 query failed",
    });
  });
});

describe("invalidRowError", () => {
  it("wraps a message in invalid_row", () => {
    expect(invalidRowError("bad row")).toEqual({
      type: "invalid_row",
      message: "bad row",
    });
  });
});
