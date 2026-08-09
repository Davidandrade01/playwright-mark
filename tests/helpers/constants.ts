import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { TaskModel } from '../fixtures/task.model';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = process.env.BASE_URL;

async function deleteTask(request: APIRequestContext, taskName: string) {
  await request.delete(`${BASE_URL}/helper/tasks/${taskName}`);
}

async function postTask(request: APIRequestContext, task: TaskModel) {
  await request.post(`${BASE_URL}/tasks`, {
    data: task,
  });
}

export { deleteTask, postTask };
