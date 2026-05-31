import { describe, expect, it } from "vite-plus/test";

import {
  buildSaveUserResourceQuery,
  buildSelectUserResourceQuery,
} from "#/modules/library/adapters/d1/build-save-user-resource-query";

describe("buildSaveUserResourceQuery", () => {
  it("builds insert SQL with user/resource conflict target and default pending state", () => {
    const query = buildSaveUserResourceQuery(
      "app-1",
      "res-linux-journey",
      "ur-1",
      "2026-01-01T00:00:00.000Z",
    );

    expect(query.sql).toContain("INSERT INTO user_resources");
    expect(query.sql).toContain("'pending'");
    expect(query.sql).toContain("ON CONFLICT(user_id, resource_id) DO NOTHING");
    expect(query.bindings).toEqual({
      id: "ur-1",
      userId: "app-1",
      resourceId: "res-linux-journey",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });
});

describe("buildSelectUserResourceQuery", () => {
  it("selects by user_id and resource_id", () => {
    const query = buildSelectUserResourceQuery("app-1", "res-linux-journey");

    expect(query.sql).toContain("FROM user_resources");
    expect(query.sql).toContain("WHERE user_id = ? AND resource_id = ?");
    expect(query.bindings).toEqual({
      userId: "app-1",
      resourceId: "res-linux-journey",
    });
  });
});
