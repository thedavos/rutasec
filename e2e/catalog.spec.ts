import { expect, test, type Page } from "@playwright/test";

function catalogResourceTitleLink(page: Page, name: string | RegExp) {
  return page.locator('a[href^="/resources/"]').filter({ hasText: name });
}

test("public catalog lists resources without login", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await expect(catalogResourceTitleLink(page, /Linux Journey/i)).toBeVisible();
  await expect(page.getByText("Beginner").first()).toBeVisible();
  await expect(page.getByText("Free").first()).toBeVisible();
  await expect(page.getByText("Hours").first()).toBeVisible();
});

test("resource detail shows linked attribution", async ({ page }) => {
  await page.goto("/");

  const detailLink = catalogResourceTitleLink(page, /Linux Journey/i).first();
  await expect(detailLink).toBeVisible({ timeout: 15_000 });
  const href = await detailLink.getAttribute("href");
  if (!href) {
    throw new Error("Expected Linux Journey catalog link to include an href");
  }
  await page.goto(href);

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

test("catalog discovery controls stay pinned while scrolling", async ({ page }) => {
  await page.goto("/");

  const hero = page.getByRole("heading", { name: /Cybersecurity learning resources/i });
  const search = page.getByRole("searchbox", { name: /Search catalog/i });

  await expect(hero).toBeVisible();
  await expect(search).toBeVisible();

  await page.evaluate(() => window.scrollBy(0, 800));

  await expect(search).toBeInViewport();
  await expect(hero).not.toBeInViewport();
});
