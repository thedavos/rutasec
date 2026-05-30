import { describe, expect, it } from "vite-plus/test";

import { catalogErrorMessage } from "#/modules/catalog/domain/errors/catalog-errors";

describe("catalogErrorMessage", () => {
  it("returns the message for invalid_row errors", () => {
    expect(catalogErrorMessage({ type: "invalid_row", message: "bad row" })).toBe("bad row");
  });

  it("returns the message for query_failed errors", () => {
    expect(catalogErrorMessage({ type: "query_failed", message: "D1 down" })).toBe("D1 down");
  });

  it("returns a stable message for not_found errors", () => {
    expect(catalogErrorMessage({ type: "not_found" })).toBe("Resource not found");
  });
});
