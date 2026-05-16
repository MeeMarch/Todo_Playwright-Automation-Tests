import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todo-page';
import { SINGLE_TODO, EDITED_TODO } from './helpers/test-data';

test.describe('Edit Todo', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addTodo(SINGLE_TODO);
  });

  test('TC-11: should edit a todo with new text', async () => {
    await todoPage.editTodo(0, EDITED_TODO);

    expect(await todoPage.getTodoText(0)).toBe(EDITED_TODO);
  });

  test('TC-12: should delete a todo when edited to empty text', async () => {
    await todoPage.clearEditTodo(0);

    await expect(todoPage.todoItems).toHaveCount(0);
  });
});
