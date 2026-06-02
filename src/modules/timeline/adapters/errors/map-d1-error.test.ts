import { describe, expect, it } from "vite-plus/test";

import { invalidRowError, mapD1Error } from "#/modules/timeline/adapters/errors/map-d1-error";

describe("mapD1Error", () => {
  it("maps unknown errors to query_failed", () => {
    expect(mapD1Error(new Error("boom"))).toEqual({
      type: "query_failed",
      message: "boom",
    });
  });

  it("creates invalid_row errors", () => {
    expect(invalidRowError("bad row")).toEqual({
      type: "invalid_row",
      message: "bad row",
    });
  });
});
