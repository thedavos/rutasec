import { describe, expect, it } from "vite-plus/test";

import { invalidRowError, mapD1Error } from "#/modules/catalog/adapters/errors/map-d1-error";

describe("mapD1Error", () => {
  it("maps Error instances to query_failed", () => {
    expect(mapD1Error(new Error("timeout"))).toEqual({
      type: "query_failed",
      message: "timeout",
    });
  });

  it("uses a fallback message for non-Error values", () => {
    expect(mapD1Error("unknown")).toEqual({
      type: "query_failed",
      message: "D1 query failed",
    });
  });
});

describe("invalidRowError", () => {
  it("creates an invalid_row error", () => {
    expect(invalidRowError("schema mismatch")).toEqual({
      type: "invalid_row",
      message: "schema mismatch",
    });
  });
});
