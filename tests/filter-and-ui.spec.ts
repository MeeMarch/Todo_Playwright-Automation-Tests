import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todo-page';
import { TODO_ITEMS } from './helpers/test-data';

test.describe('Filter and UI', () => {
  let todoPage: TodoPage;

  /**
   * Shared setup: add three todos and mark the first one as completed.
   * This gives us a mix of active and completed items for filter tests.
   */
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();

    for (const item of TODO_ITEMS) {
      await todoPage.addTodo(item);
    }

    // Mark the first item as completed
    await todoPage.toggleTodo(0);
  });

  // ── Filters ─────────────────────────────────────────────────

  test('TC-13: filter "All" should show all todos', async () => {
    await todoPage.filterAll();

    await expect(todoPage.todoItems).toHaveCount(TODO_ITEMS.length);
  });

  test('TC-14: filter "Active" should show only active todos', async () => {
    await todoPage.filterActive();

    // 1 completed + 2 active → only 2 should be visible
    await expect(todoPage.todoItems).toHaveCount(2);

    const texts = await todoPage.getAllTodoTexts();
    expect(texts).toEqual([TODO_ITEMS[1], TODO_ITEMS[2]]);
  });

  test('TC-15: filter "Completed" should show only completed todos', async () => {
    await todoPage.filterCompleted();

    await expect(todoPage.todoItems).toHaveCount(1);
    expect(await todoPage.getTodoText(0)).toBe(TODO_ITEMS[0]);
  });

  // ── Clear Completed Button Visibility ───────────────────────

  test('TC-16: Clear Completed button should appear/disappear based on completed items', async () => {
    // There is 1 completed item → button should be visible
    await expect(todoPage.clearCompletedButton).toBeVisible();

    // Uncomplete the first item → no completed items → button should be hidden
    await todoPage.toggleTodo(0);
    await expect(todoPage.clearCompletedButton).toBeHidden();

    // Re-complete it → button should appear again
    await todoPage.toggleTodo(0);
    await expect(todoPage.clearCompletedButton).toBeVisible();
  });

  // ── Todo Count ──────────────────────────────────────────────

  test('TC-17: should display the correct remaining todo count', async () => {
    // 3 added, 1 completed → 2 active items left
    await expect(todoPage.todoCount).toContainText('2');

    // Complete another item → 1 item left
    await todoPage.toggleTodo(1);
    await expect(todoPage.todoCount).toContainText('1');

    // Uncomplete the first item → 2 items left again
    await todoPage.toggleTodo(0);
    await expect(todoPage.todoCount).toContainText('2');
  });
});
