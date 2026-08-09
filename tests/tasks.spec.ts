import { test, expect } from '@playwright/test';
import { TaskModel } from './fixtures/task.model';
import { deleteTask, postTask } from './helpers/constants';
import { createTask } from './pages/home.page';
import data from './fixtures/tasks.json';
import { env } from 'process';

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
  const task = data.success as TaskModel;

  await deleteTask(request, task.name);
  await createTask(page, task.name);

  await expect(page.getByText(task.name)).toBeVisible();
});
 test('não deve cadastrar tarefa duplicada', async ({ page, request }) => {
   const task = data.duplicate as TaskModel;

   await deleteTask(request, task.name);
   await postTask(request, task);

   await createTask(page, task.name);

   await expect(page.getByText('Task already exists!')).toBeVisible();
 });

 test('Preenchimento obrigatório', async ({ page }) => {
//   const task = data.required as TaskModel;

//   await page.goto('http://localhost:8080');
//   await page.getByPlaceholder('Add a new Task').fill(task.name);
//   await page.getByRole('button', { name: 'Create' }).click();

//   const input = page.getByPlaceholder('Add a new Task');
//   const message = await input.evaluate(
//     (e) => (e as HTMLInputElement).validationMessage
//   );

//   expect(message).toBeTruthy();
 });

 test('deve concluir uma tarefa', async ({ page, request }) => {
   const task = data.update as TaskModel;

   await deleteTask(request, task.name);
   await postTask(request, task);

   await page.goto('http://localhost:8080');

   // O botão de concluir não é um checkbox; fica dentro do item da tarefa
   const taskItem = page.getByTestId('task-item').filter({ hasText: task.name });
   const toggle = taskItem.locator('button').first();

   await toggle.click();

   await expect(toggle).toHaveClass(/listItemToggleSelected/);
 });


test('deve ser deletada uma tarefa', async ({ page, request }) => {
  const task = {
    ...data.delete,
    name: `Comprar leite ${Date.now()}`,
  } as TaskModel;

  await deleteTask(request, task.name);
  await postTask(request, task);

  await page.goto ('/');

  // A lixeira é um <button> sem texto; o SVG fica dentro dele
  const taskItem = page.getByTestId('task-item').filter({ hasText: task.name });
  const deleteButton = taskItem.locator('button').last();

  await deleteButton.click();

  await expect(taskItem).not.toBeVisible();
});
