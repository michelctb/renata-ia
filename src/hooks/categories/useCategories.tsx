
import { useState } from 'react';
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import { useCategoriesData } from './useCategoriesData';
import { useCategoryOperations } from './useCategoryOperations';
import { useCategoryDelete } from './useCategoryDelete';

/**
 * Main hook for category management, combining data loading, CRUD operations
 */
export function useCategories() {
  const { 
    user, 
    categories, 
    setCategories, 
    metas, 
    setMetas, 
    isLoading 
  } = useCategoriesData();
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMeta, setEditingMeta] = useState<MetaCategoria | null>(null);
  
  const { handleSubmitCategory } = useCategoryOperations({ 
    user,
    categories, 
    setCategories, 
    metas, 
    setMetas 
  });
  
  const { 
    categoryToDelete, 
    setCategoryToDelete, 
    deleteSelectedCategory 
  } = useCategoryDelete({ 
    categories, 
    setCategories, 
    metas, 
    setMetas 
  });

  return {
    user,
    categories,
    metas,
    isLoading,
    editingCategory,
    setEditingCategory,
    editingMeta,
    setEditingMeta,
    categoryToDelete,
    setCategoryToDelete,
    handleSubmitCategory,
    deleteSelectedCategory
  };
}
