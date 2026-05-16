import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/todo-page';
import {
  SINGLE_TODO,
  TODO_ITEMS,
  WHITESPACE_ONLY,
  PADDED_TODO,
  TRIMMED_TODO,
} from './helpers/test-data';

test.describe('Add Todo', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('TC-01: should add a single todo', async () => {
    await todoPage.addTodo(SINGLE_TODO);

    await expect(todoPage.todoItems).toHaveCount(1);
    expect(await todoPage.getTodoText(0)).toBe(SINGLE_TODO);
  });

  test('TC-02: should add multiple todos in order', async () => {
    for (const item of TODO_ITEMS) {
      await todoPage.addTodo(item);
    }

    await expect(todoPage.todoItems).toHaveCount(TODO_ITEMS.length);

    const allTexts = await todoPage.getAllTodoTexts();
    expect(allTexts).toEqual([...TODO_ITEMS]);
  });

  test('TC-03: should not add todo when pressing Enter with empty input', async () => {
    await todoPage.pressEnterOnEmpty();

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('TC-04: should not add todo when input is whitespace only', async () => {
    await todoPage.addTodo(WHITESPACE_ONLY);

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('TC-05: should trim leading and trailing spaces', async () => {
    await todoPage.addTodo(PADDED_TODO);

    await expect(todoPage.todoItems).toHaveCount(1);
    expect(await todoPage.getTodoText(0)).toBe(TRIMMED_TODO);
  });
});
