import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the TodoMVC application.
 *
 * Encapsulates all element selectors and user interactions so that
 * test specs remain readable and any future selector changes only
 * need to be updated in one place.
 */
export class TodoPage {
  // ── Locators ────────────────────────────────────────────────
  /** The main text input for adding new todos */
  readonly newTodoInput: Locator;
  /** The list of all todo items */
  readonly todoItems: Locator;
  /** The "items left" counter in the footer */
  readonly todoCount: Locator;
  /** The "Clear completed" button */
  readonly clearCompletedButton: Locator;
  /** Toggle-all checkbox (mark all as complete) */
  readonly toggleAll: Locator;

  constructor(public readonly page: Page) {
    this.newTodoInput = page.locator('input.new-todo');
    this.todoItems = page.locator('ul.todo-list li');
    this.todoCount = page.locator('span.todo-count');
    this.clearCompletedButton = page.locator('button.clear-completed');
    this.toggleAll = page.locator('label[for="toggle-all"]');
  }

  // ── Navigation ──────────────────────────────────────────────

  /** Navigate to the TodoMVC app */
  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/#/');
  }

  // ── Add ─────────────────────────────────────────────────────

  /** Type text into the new-todo input and press Enter */
  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  /** Press Enter on the new-todo input without typing anything */
  async pressEnterOnEmpty() {
    await this.newTodoInput.press('Enter');
  }

  // ── Read ────────────────────────────────────────────────────

  /** Return the visible text of a todo at the given 0-based index */
  async getTodoText(index: number): Promise<string> {
    return (await this.todoItems.nth(index).locator('label').textContent()) ?? '';
  }

  /** Return all visible todo texts as an array */
  async getAllTodoTexts(): Promise<string[]> {
    return this.todoItems.locator('label').allTextContents();
  }

  /** Return the number of todo items currently in the list */
  async getTodoItemCount(): Promise<number> {
    return this.todoItems.count();
  }

  // ── Complete / Uncomplete ───────────────────────────────────

  /** Click the toggle checkbox for the todo at the given index */
  async toggleTodo(index: number) {
    await this.todoItems.nth(index).locator('input.toggle').click();
  }

  /** Assert that the todo at the given index has the "completed" class */
  async expectCompleted(index: number) {
    await expect(this.todoItems.nth(index)).toHaveClass(/completed/);
  }

  /** Assert that the todo at the given index does NOT have the "completed" class */
  async expectNotCompleted(index: number) {
    await expect(this.todoItems.nth(index)).not.toHaveClass(/completed/);
  }

  // ── Delete ──────────────────────────────────────────────────

  /**
   * Delete the todo at the given index by hovering over it
   * and clicking the destroy (×) button.
   */
  async deleteTodo(index: number) {
    const item = this.todoItems.nth(index);
    await item.hover();
    await item.locator('button.destroy').click();
  }

  // ── Edit ────────────────────────────────────────────────────

  /**
   * Double-click a todo to enter edit mode, clear the existing text,
   * type new text, and press Enter to confirm.
   */
  async editTodo(index: number, newText: string) {
    const item = this.todoItems.nth(index);
    await item.locator('label').dblclick();
    const editInput = item.locator('input.edit');
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  /**
   * Double-click a todo to enter edit mode, clear all text,
   * and press Enter (which should delete the item).
   */
  async clearEditTodo(index: number) {
    const item = this.todoItems.nth(index);
    await item.locator('label').dblclick();
    const editInput = item.locator('input.edit');
    await editInput.fill('');
    await editInput.press('Enter');
  }

  // ── Filter ──────────────────────────────────────────────────

  /** Click the "All" filter link */
  async filterAll() {
    await this.page.locator('a[href="#/"]').click();
  }

  /** Click the "Active" filter link */
  async filterActive() {
    await this.page.locator('a[href="#/active"]').click();
  }

  /** Click the "Completed" filter link */
  async filterCompleted() {
    await this.page.locator('a[href="#/completed"]').click();
  }

  // ── Clear Completed ─────────────────────────────────────────

  /** Click the "Clear completed" button */
  async clearCompleted() {
    await this.clearCompletedButton.click();
  }
}
