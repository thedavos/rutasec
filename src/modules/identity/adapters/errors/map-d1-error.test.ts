import { describe, expect, it } from "vite-plus/test";

import { invalidRowError, mapD1Error } from "#/modules/identity/adapters/errors/map-d1-error";

describe("mapD1Error", () => {
  it("maps Error instances to query_failed", () => {
    expect(mapD1Error(new Error("constraint failed"))).toEqual({
      type: "query_failed",
      message: "constraint failed",
    });
  });

  it("maps unknown values to a default message", () => {
    expect(mapD1Error("boom")).toEqual({
      type: "query_failed",
      message: "D1 query failed",
    });
  });
});

describe("invalidRowError", () => {
  it("returns invalid_row with the provided message", () => {
    expect(invalidRowError("bad row")).toEqual({
      type: "invalid_row",
      message: "bad row",
    });
  });
});
