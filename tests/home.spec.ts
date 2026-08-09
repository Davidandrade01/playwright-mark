import { test, expect } from "@playwright/test";

test("test if home page is loaded", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await expect(page).toHaveTitle("Gerencie suas tarefas com Mark L");
  await page.waitForTimeout(1000);
});
