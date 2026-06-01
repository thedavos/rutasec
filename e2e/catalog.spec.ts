import { expect, test } from "@playwright/test";

test("public catalog lists resources without login", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await expect(page.getByLabel("Catalog filters")).toBeVisible();
  await expect(page.getByLabel("Catalog transparency")).toBeVisible();
  await expect(page.getByText(/Original source:/).first()).toBeVisible();
  await expect(page.getByText(/Curated from:/).first()).toBeVisible();
});

test("resource detail shows linked attribution", async ({ page }) => {
  await page.goto("/");

  await page.locator('a[href^="/resources/"]').first().click();

  await expect(page.getByRole("heading", { name: "Attribution" })).toBeVisible();
  await expect(page.getByText(/Original source:/)).toBeVisible();
  await expect(page.getByText(/Curated from:/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Linux Journey/i })).toBeVisible();
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
