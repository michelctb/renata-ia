
// Re-export types
export type { Category } from './types';

// Re-export constants
export { CATEGORIES_TABLE } from './constants';

// Re-export operations
export {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from './operations';
