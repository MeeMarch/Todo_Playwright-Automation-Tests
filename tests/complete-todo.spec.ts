import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todo-page';
import { SINGLE_TODO } from './helpers/test-data';

test.describe('Complete / Uncomplete Todo', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addTodo(SINGLE_TODO);
  });

  test('TC-06: should mark a todo as completed', async () => {
    await todoPage.toggleTodo(0);

    await todoPage.expectCompleted(0);
  });

  test('TC-07: should unmark a completed todo back to active', async () => {
    // First complete
    await todoPage.toggleTodo(0);
    await todoPage.expectCompleted(0);

    // Then uncomplete
    await todoPage.toggleTodo(0);
    await todoPage.expectNotCompleted(0);
  });
});
