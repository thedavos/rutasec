import { expect, test, type Page } from "@playwright/test";

function catalogResourceTitleLink(page: Page, name: string | RegExp) {
  return page.locator('a[href^="/resources/"]').filter({ hasText: name });
}

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

  await catalogResourceTitleLink(page, /Linux Journey/i)
    .first()
    .click();

  await expect(page.getByText("Attribution", { exact: true })).toBeVisible();
  await expect(page.getByText(/Original source:/)).toBeVisible();
  await expect(page.getByText(/Curated from:/)).toBeVisible();
  await expect(
    page.locator('a[target="_blank"]').filter({ hasText: /Linux Journey/i }),
  ).toBeVisible();
});

test("catalog search filters resources by query param", async ({ page }) => {
  await page.goto("/?q=linux");

  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await expect(catalogResourceTitleLink(page, /Linux Journey/i)).toBeVisible();
});

test("catalog search combines with level filter", async ({ page }) => {
  await page.goto("/?q=linux&level=beginner");

  await expect(catalogResourceTitleLink(page, /Linux Journey/i)).toBeVisible();
});
