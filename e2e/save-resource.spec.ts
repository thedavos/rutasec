import { expect, test, type Page } from "@playwright/test";

import { uniqueE2eEmail } from "./test-data";

async function openFirstResourceDetail(page: Page) {
  const detailLink = page.locator('a[href^="/resources/"]').first();
  await expect(detailLink).toBeVisible({ timeout: 15_000 });
  const href = await detailLink.getAttribute("href");
  if (!href) {
    throw new Error("Expected catalog resource link to include an href");
  }
  await page.goto(href);
}

test("visitor can save a resource without signing in", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await openFirstResourceDetail(page);

  await expect(page.getByRole("button", { name: "Save to library" })).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "Save to library" }).click();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });

  await page.reload();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });
});

test("guest library page shows locally saved resources", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await openFirstResourceDetail(page);

  await expect(page.getByRole("button", { name: "Save to library" })).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "Save to library" }).click();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });

  await page.goto("/library");
  await expect(page.getByRole("heading", { name: "Saved on this device" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.locator('a[href^="/resources/"]').first()).toBeVisible();
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
  await openFirstResourceDetail(page);

  await expect(page.getByRole("button", { name: "Save to library" })).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "Save to library" }).click();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });

  await page.reload();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });
});

test("guest saves sync into authenticated library after sign-up", async ({ page }, testInfo) => {
  test.setTimeout(90_000);

  const email = uniqueE2eEmail(testInfo);
  const password = "test-password-123";

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await openFirstResourceDetail(page);

  await expect(page.getByRole("button", { name: "Save to library" })).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "Save to library" }).click();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });

  await page.goto("/sign-up");
  await expect(page.getByRole("banner").getByRole("link", { name: "Sign up" })).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible({ timeout: 45_000 });

  await page.goto("/library");
  await expect(page.getByRole("heading", { name: "Your saved resources" })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.locator('a[href^="/resources/"]').first()).toBeVisible({
    timeout: 15_000,
  });
});
