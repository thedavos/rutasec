import { describe, expect, it } from "vite-plus/test";

import {
  buildUpsertAppUserQuery,
  selectAppUserByAuthUserIdSql,
} from "#/modules/identity/adapters/d1/build-upsert-app-user-query";

describe("buildUpsertAppUserQuery", () => {
  it("builds upsert SQL with auth_user_id conflict target and bindings", () => {
    const snapshot = {
      authUserId: "auth-1",
      email: "user@example.com",
      displayName: "Test User",
    };
    const query = buildUpsertAppUserQuery(snapshot, "app-1", "2026-01-01T00:00:00.000Z");

    expect(query.sql).toContain("INSERT INTO app_users");
    expect(query.sql).toContain("ON CONFLICT(auth_user_id) DO UPDATE SET");
    expect(query.bindings).toEqual({
      id: "app-1",
      authUserId: "auth-1",
      email: "user@example.com",
      displayName: "Test User",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("selects by auth_user_id", () => {
    expect(selectAppUserByAuthUserIdSql).toContain("WHERE auth_user_id = ?");
  });
});
