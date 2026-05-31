import { expect, test } from "@playwright/test";

test("user can register, stay signed in, and sign out", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "test-password-123";

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();

  await page.goto("/sign-up");

  await expect(page.getByRole("banner").getByRole("link", { name: "Sign up" })).toBeVisible();

  const emailInput = page.getByLabel("Email");
  const passwordInput = page.getByLabel("Password");

  await emailInput.fill(email);
  await passwordInput.fill(password);

  await expect(emailInput).toHaveValue(email);
  await expect(passwordInput).toHaveValue(password);

  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible({ timeout: 15_000 });

  await page.reload();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
});
