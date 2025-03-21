
import { useState } from 'react';
import { toast } from 'sonner';
import { Category, deleteCategory } from '@/lib/categories';
import { MetaCategoria, deleteMetaCategoria } from '@/lib/metas';

interface UseCategoryDeleteProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  metas: Record<string, MetaCategoria>;
  setMetas: React.Dispatch<React.SetStateAction<Record<string, MetaCategoria>>>;
  onSuccess?: () => void;
}

/**
 * Hook to manage category deletion
 */
export function useCategoryDelete({
  categories,
  setCategories,
  metas,
  setMetas,
  onSuccess
}: UseCategoryDeleteProps) {
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  /**
   * Sets up a category for deletion and opens the confirmation dialog
   */
  const handleDeleteRequest = (id: number) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  /**
   * Handles the actual deletion after confirmation
   */
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return false;
    
    setIsDeleting(true);
    try {
      // Find the category by ID
      const categoryToDeleteObj = categories.find(c => c.id === categoryToDelete);
      
      if (categoryToDeleteObj) {
        // Check if the category has a meta and delete it first
        const metaToDelete = metas[categoryToDeleteObj.nome];
        if (metaToDelete && metaToDelete.id) {
          await deleteMetaCategoria(metaToDelete.id);
          
          // Update metas state
          const newMetas = { ...metas };
          delete newMetas[categoryToDeleteObj.nome];
          setMetas(newMetas);
        }
      }
      
      // Delete the category
      await deleteCategory(categoryToDelete);
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete));
      toast.success('Category deleted successfully!');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category. Please try again.');
      return false;
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  /**
   * Function to execute deletion without confirmation dialog
   * (used by other components that handle their own confirmation)
   */
  const deleteSelectedCategory = async () => {
    if (!categoryToDelete) return false;
    
    try {
      // Find the category by ID
      const categoryToDeleteObj = categories.find(c => c.id === categoryToDelete);
      
      if (categoryToDeleteObj) {
        // Check if the category has a meta and delete it first
        const metaToDelete = metas[categoryToDeleteObj.nome];
        if (metaToDelete && metaToDelete.id) {
          await deleteMetaCategoria(metaToDelete.id);
          
          // Update metas state
          const newMetas = { ...metas };
          delete newMetas[categoryToDeleteObj.nome];
          setMetas(newMetas);
        }
      }
      
      // Delete the category
      await deleteCategory(categoryToDelete);
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete));
      toast.success('Category deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category. Please try again.');
      return false;
    }
  };

  return {
    categoryToDelete,
    setCategoryToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteRequest,
    handleConfirmDelete,
    deleteSelectedCategory,
    isDeleting
  };
}
