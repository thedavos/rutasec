import { describe, expect, it } from "vite-plus/test";

import { mapAppUserRow } from "#/modules/identity/adapters/mappers/map-app-user-row";

describe("mapAppUserRow", () => {
  it("maps snake_case rows to camelCase AppUser", () => {
    expect(
      mapAppUserRow({
        id: "app-1",
        auth_user_id: "auth-1",
        email: "user@example.com",
        display_name: "Test User",
        role: "user",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      }),
    ).toEqual({
      id: "app-1",
      authUserId: "auth-1",
      email: "user@example.com",
      displayName: "Test User",
      role: "user",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
  });
});
