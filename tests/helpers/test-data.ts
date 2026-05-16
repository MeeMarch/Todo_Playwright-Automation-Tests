/**
 * Test Data Constants
 * Centralized test data for TodoMVC automation tests.
 * Keeping test data separate makes it easy to maintain and update.
 */

/** Default todo items used for multi-item tests */
export const TODO_ITEMS = [
  'Buy groceries',
  'Clean the house',
  'Read a book',
] as const;

/** Single todo item for basic tests */
export const SINGLE_TODO = 'Buy groceries';

/** Text used when editing an existing todo */
export const EDITED_TODO = 'Buy groceries and cook dinner';

/** Whitespace-only input (should not create a todo) */
export const WHITESPACE_ONLY = '   ';

/** Text with leading/trailing spaces (should be trimmed) */
export const PADDED_TODO = '  Buy milk  ';

/** Expected trimmed result of PADDED_TODO */
export const TRIMMED_TODO = 'Buy milk';
