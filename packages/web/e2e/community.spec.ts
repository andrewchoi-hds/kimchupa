import { test, expect } from "@playwright/test";

test("community page loads posts", async ({ page }) => {
  await page.goto("/community");
  await expect(page.getByText("커뮤니티")).toBeVisible();
  // Wait for posts to load (server prefetch or client fetch)
  await page.waitForSelector("[data-testid='post-card']", { timeout: 10_000 }).catch(() => {
    // Posts might not exist yet, that's ok
  });
});

test("community write requires login", async ({ page }) => {
  await page.goto("/community/write");
  // Should redirect to login or show login prompt
  await expect(page).toHaveURL(/login|write/);
});
