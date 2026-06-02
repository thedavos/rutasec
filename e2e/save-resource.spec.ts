import { expect, test } from "@playwright/test";

import { uniqueE2eEmail } from "./test-data";

test("visitor sees sign-in CTA on resource detail", async ({ page }) => {
  await page.goto("/");

  await page.locator('a[href^="/resources/"]').first().click();

  await expect(page.getByRole("link", { name: "Sign in to save" })).toBeVisible();
});

test("authenticated user can save a resource from detail", async ({ page }, testInfo) => {
  const email = uniqueE2eEmail(testInfo);
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

  await page.goto("/");
  const detailLink = page.locator('a[href^="/resources/"]').first();
  await detailLink.click();

  await expect(page.getByRole("button", { name: "Save to library" })).toBeVisible();
  await page.getByRole("button", { name: "Save to library" }).click();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });

  await page.reload();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });
});
