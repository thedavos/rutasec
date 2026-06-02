import { expect, test, type Page } from "@playwright/test";

async function signUp(page: Page) {
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
}

async function saveLinuxJourneyResource(page: Page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Cybersecurity learning resources/i }),
  ).toBeVisible();
  const resourceLink = page
    .locator('a[href^="/resources/"]')
    .filter({ hasText: /Linux Journey/i })
    .first();
  await expect(resourceLink).toBeVisible();
  const resourcePath = await resourceLink.getAttribute("href");
  if (!resourcePath) {
    throw new Error("Expected a catalog resource link for Linux Journey");
  }
  await page.goto(resourcePath);
  await expect(page.getByRole("button", { name: "Save to library" })).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "Save to library" }).click();
  await expect(page.getByRole("button", { name: "Saved to library" })).toBeVisible({
    timeout: 15_000,
  });

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Learning overview" })).toBeVisible({
    timeout: 15_000,
  });
}

async function createGoalWithLinkedResource(page: Page, goalTitle: string) {
  await page.goto("/goals");
  await expect(page.getByRole("heading", { name: "Your objectives" })).toBeVisible();

  await page.getByLabel("Title").fill(goalTitle);
  await page.getByLabel("Hours per week").fill("5");
  await page.getByRole("button", { name: "Create goal" }).click();
  await expect(page.getByRole("button", { name: "Create goal" })).toBeEnabled({ timeout: 15_000 });

  await expect(async () => {
    await page.goto("/goals");
    await expect(
      page.locator('[data-slot="card"]').filter({ hasText: goalTitle }).getByRole("link", {
        name: "View study timeline",
      }),
    ).toBeVisible();
  }).toPass({ timeout: 15_000 });

  const goalCard = page.locator('[data-slot="card"]').filter({ hasText: goalTitle });
  await goalCard.getByLabel("Add from library").click();
  await page.getByRole("option", { name: /Linux Journey/i }).click();
  await expect(goalCard.getByRole("heading", { name: "Linked resources", level: 3 })).toBeVisible({
    timeout: 15_000,
  });
}

test("authenticated user can open, generate, and view weekly study timeline", async ({ page }) => {
  const goalTitle = `E2E timeline ${Date.now()}`;

  await signUp(page);
  await saveLinuxJourneyResource(page);
  await createGoalWithLinkedResource(page, goalTitle);

  const goalCard = page.locator('[data-slot="card"]').filter({ hasText: goalTitle });
  await goalCard.getByRole("link", { name: "View study timeline" }).click();
  await expect(page.getByRole("heading", { name: goalTitle })).toBeVisible();
  await expect(page.getByText("No study plan yet")).toBeVisible();

  await page.getByRole("button", { name: "Generate study plan" }).click();
  await expect(page.getByText("Week 1")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("1 resource")).toBeVisible();
  await expect(page.getByText(`${goalTitle} study plan`)).toBeVisible();
  await expect(page.getByRole("link", { name: /Linux Journey/i })).toBeVisible();

  await page.goto("/dashboard");
  await expect(
    page.locator('[data-slot="card-title"]').filter({ hasText: goalTitle }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View study timeline" }).click();
  await expect(page.getByText("Study timeline")).toBeVisible();
  await expect(page.getByRole("heading", { name: goalTitle })).toBeVisible();
  await expect(page.getByText("Week 1")).toBeVisible();
});
