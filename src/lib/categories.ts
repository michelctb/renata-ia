
// Backward compatibility file
// This file re-exports everything from the new modular structure

export type { Category } from './categories/types';
export { CATEGORIES_TABLE } from './categories/constants';
export {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from './categories/operations';
