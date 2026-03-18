import { test, expect } from "@playwright/test";

test("wiki page loads kimchi list", async ({ page }) => {
  await page.goto("/wiki");
  await expect(page.getByText("김치피디아")).toBeVisible();
});

test("wiki detail page loads", async ({ page }) => {
  await page.goto("/wiki/baechu");
  await expect(page.getByText("배추김치")).toBeVisible();
});
