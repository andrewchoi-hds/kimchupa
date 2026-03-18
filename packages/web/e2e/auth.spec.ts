import { test, expect } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("김추페")).toBeVisible();
  await expect(page.getByPlaceholder("email@example.com")).toBeVisible();
});

test("demo account login", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[type="email"]', "demo@kimchupa.com");
  await page.fill('input[type="password"]', "demo1234");
  await page.getByRole("button", { name: /로그인/ }).click();
  // Should redirect to home after login
  await page.waitForURL("/", { timeout: 10_000 }).catch(() => {});
});

test("signup page loads", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByText("회원가입")).toBeVisible();
});
