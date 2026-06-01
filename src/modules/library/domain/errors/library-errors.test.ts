import { describe, expect, it } from "vite-plus/test";

import { libraryErrorMessage } from "#/modules/library/domain/errors/library-errors";

describe("libraryErrorMessage", () => {
  it("returns the message for invalid_row errors", () => {
    expect(libraryErrorMessage({ type: "invalid_row", message: "bad row" })).toBe("bad row");
  });

  it("returns the message for query_failed errors", () => {
    expect(libraryErrorMessage({ type: "query_failed", message: "D1 down" })).toBe("D1 down");
  });

  it("returns a stable message for resource_not_found errors", () => {
    expect(libraryErrorMessage({ type: "resource_not_found" })).toBe("Resource not found");
  });

  it("returns a stable message for user_resource_not_found errors", () => {
    expect(libraryErrorMessage({ type: "user_resource_not_found" })).toBe(
      "Resource is not in your library",
    );
  });
});
