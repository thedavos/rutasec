import { expect, test } from "@playwright/test";

test("public catalog lists resources without login", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  await expect(page.getByLabel("Catalog filters")).toBeVisible();
  await expect(page.getByText(/Source:/).first()).toBeVisible();
});
