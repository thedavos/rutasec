import { describe, expect, it } from "vite-plus/test";

import {
  identityErrorMessage,
  unauthorizedError,
} from "#/modules/identity/domain/errors/identity-errors";

describe("identityErrorMessage", () => {
  it("maps unauthorized to a stable message", () => {
    expect(identityErrorMessage(unauthorizedError())).toBe("Authentication required");
  });

  it("passes through invalid_row and query_failed messages", () => {
    expect(identityErrorMessage({ type: "invalid_row", message: "bad row" })).toBe("bad row");
    expect(identityErrorMessage({ type: "query_failed", message: "db down" })).toBe("db down");
  });
});
