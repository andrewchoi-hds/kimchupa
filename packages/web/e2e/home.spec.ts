import { test, expect } from "@playwright/test";

test("homepage loads successfully", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/김추페/);
  await expect(page.getByText("김추페")).toBeVisible();
});

test("navigation links work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /김치백과|Wiki/ }).click();
  await expect(page).toHaveURL(/wiki/);
});
