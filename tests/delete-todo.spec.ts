import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todo-page';
import { TODO_ITEMS } from './helpers/test-data';

test.describe('Delete Todo', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('TC-08: should delete a single todo from the list', async () => {
    // Add two items so we can verify only the targeted one is removed
    await todoPage.addTodo(TODO_ITEMS[0]);
    await todoPage.addTodo(TODO_ITEMS[1]);
    await expect(todoPage.todoItems).toHaveCount(2);

    // Delete the first item
    await todoPage.deleteTodo(0);

    await expect(todoPage.todoItems).toHaveCount(1);
    expect(await todoPage.getTodoText(0)).toBe(TODO_ITEMS[1]);
  });

  test('TC-09: should delete all todos until the list is empty', async () => {
    for (const item of TODO_ITEMS) {
      await todoPage.addTodo(item);
    }
    await expect(todoPage.todoItems).toHaveCount(TODO_ITEMS.length);

    // Delete all items one by one (always delete the first remaining)
    for (let i = 0; i < TODO_ITEMS.length; i++) {
      await todoPage.deleteTodo(0);
    }

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('TC-10: should clear only completed todos when clicking Clear Completed', async () => {
    // Add three items
    for (const item of TODO_ITEMS) {
      await todoPage.addTodo(item);
    }

    // Mark the first and third as completed
    await todoPage.toggleTodo(0);
    await todoPage.toggleTodo(2);

    // Click "Clear completed"
    await todoPage.clearCompleted();

    // Only the second (active) item should remain
    await expect(todoPage.todoItems).toHaveCount(1);
    expect(await todoPage.getTodoText(0)).toBe(TODO_ITEMS[1]);
  });
});
