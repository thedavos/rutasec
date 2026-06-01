import { expect, test } from "@playwright/test";

test("public catalog lists resources without login", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await expect(page.getByLabel("Catalog filters")).toBeVisible();
  await expect(page.getByText(/Source:/).first()).toBeVisible();
});

test("catalog search filters resources by query param", async ({ page }) => {
  await page.goto("/?q=linux");

  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Linux Journey/i })).toBeVisible();
});

test("catalog search combines with level filter", async ({ page }) => {
  await page.goto("/?q=linux&level=beginner");

  await expect(page.getByRole("link", { name: /Linux Journey/i })).toBeVisible();
});
