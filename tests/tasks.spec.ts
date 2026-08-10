import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import { TaskModel } from './fixtures/task.model';
import data from './fixtures/tasks.json';
import { deleteTask, postTask } from './helpers/constants';
import { createTask } from './pages/home.page';

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
  const taskName = `Tarefa ${faker.string.uuid()}`;
  await deleteTask(request, taskName);
  await createTask(page, taskName);
  await expect(page.getByText(taskName, { exact: true })).toBeVisible();
});

test('nao deve cadastrar tarefa duplicada', async ({ page, request }) => {
  const task = data.duplicate as TaskModel;
  await deleteTask(request, task.name);
  await postTask(request, task);
  await createTask(page, task.name);
  await expect(page.getByText('Task already exists!')).toBeVisible();
});

test.skip('Preenchimento obrigatorio', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Create' }).click();
  const input = page.getByPlaceholder('Add a new Task');
  const message = await input.evaluate((e) => (e as HTMLInputElement).validationMessage);
  expect(message).toBeTruthy();
});

test.skip('deve concluir uma tarefa', async ({ page, request }) => {
  const task = data.update as TaskModel;
  await deleteTask(request, task.name);
  await postTask(request, task);
  await page.goto('/');
  const taskItem = page.getByTestId('task-item').filter({ hasText: task.name });
  const toggle = taskItem.locator('button').first();
  await toggle.click();
  await expect(toggle).toHaveClass(/listItemToggleSelected/);
});

test.skip('deve ser deletada uma tarefa', async ({ page, request }) => {
  const taskName = `Comprar leite ${faker.string.uuid()}`;
  const task = { ...data.delete, name: taskName } as TaskModel;
  await deleteTask(request, task.name);
  await postTask(request, task);
  await page.goto('/');
  const taskItem = page.getByTestId('task-item').filter({ hasText: task.name });
  const deleteButton = taskItem.locator('button').last();
  await deleteButton.click();
  await expect(taskItem).not.toBeVisible();
});
