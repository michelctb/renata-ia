
import { useState } from 'react';
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import { useCategoriesData } from './useCategoriesData';
import { useCategoryOperations } from './useCategoryOperations';
import { useCategoryDelete } from './useCategoryDelete';

/**
 * Main hook for category management, combining data loading, CRUD operations
 */
export function useCategories(userId?: string) {
  const { 
    user, 
    categories, 
    setCategories, 
    metas, 
    setMetas, 
    isLoading,
    refetchCategories
  } = useCategoriesData(userId);
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMeta, setEditingMeta] = useState<MetaCategoria | null>(null);
  
  const { handleSubmitCategory, isProcessing } = useCategoryOperations({ 
    user,
    categories, 
    setCategories, 
    metas, 
    setMetas 
  });
  
  const { 
    categoryToDelete, 
    setCategoryToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteRequest,
    handleConfirmDelete,
    deleteSelectedCategory
  } = useCategoryDelete({ 
    categories, 
    setCategories, 
    metas, 
    setMetas 
  });

  return {
    // Data
    user,
    categories,
    metas,
    isLoading,
    refetchCategories,
    
    // Editing state
    editingCategory,
    setEditingCategory,
    editingMeta,
    setEditingMeta,
    isProcessing,
    
    // Delete state and handlers
    categoryToDelete,
    setCategoryToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteRequest,
    handleConfirmDelete,
    
    // Main operations
    handleSubmitCategory,
    deleteSelectedCategory
  };
}
