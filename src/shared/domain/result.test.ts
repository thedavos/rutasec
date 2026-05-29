import { describe, expect, it } from "vite-plus/test";

import { err, ok, unwrap } from "#/shared/domain/result";

describe("Result helpers", () => {
  it("ok wraps a value", () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
  });

  it("err wraps an error", () => {
    expect(err("failed")).toEqual({ ok: false, error: "failed" });
  });

  it("unwrap returns the value for ok results", () => {
    expect(unwrap(ok("value"))).toBe("value");
  });

  it("unwrap throws for error results", () => {
    expect(() => unwrap(err("boom"))).toThrow("Attempted to unwrap an error Result");
  });
});
