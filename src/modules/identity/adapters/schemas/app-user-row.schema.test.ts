import { describe, expect, it } from "vite-plus/test";

import { appUserRowSchema } from "#/modules/identity/adapters/schemas/app-user-row.schema";

describe("appUserRowSchema", () => {
  it("accepts a valid app_users row", () => {
    const parsed = appUserRowSchema.safeParse({
      id: "app-1",
      auth_user_id: "auth-1",
      email: "user@example.com",
      display_name: "Test User",
      role: "user",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid email and role", () => {
    const parsed = appUserRowSchema.safeParse({
      id: "app-1",
      auth_user_id: "auth-1",
      email: "not-an-email",
      display_name: null,
      role: "superadmin",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(parsed.success).toBe(false);
  });
});
