import { Page } from '@playwright/test';

async function createTask(page: Page, taskName: string) {
  await page.goto('http://localhost:8080');
  await page.getByPlaceholder('Add a new Task').fill(taskName);
  await page.getByRole('button', { name: 'Create' }).click();
}

export { createTask };
