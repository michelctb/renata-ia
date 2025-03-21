
import { useState } from 'react';
import { toast } from 'sonner';
import { Category, deleteCategory } from '@/lib/categories';
import { MetaCategoria, deleteMetaCategoria } from '@/lib/metas';

type CategoryDeleteProps = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  metas: Record<string, MetaCategoria>;
  setMetas: React.Dispatch<React.SetStateAction<Record<string, MetaCategoria>>>;
};

/**
 * Hook to manage category deletion
 */
export function useCategoryDelete({ 
  categories, 
  setCategories, 
  metas, 
  setMetas 
}: CategoryDeleteProps) {
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const deleteSelectedCategory = async (): Promise<boolean> => {
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
      toast.error('Failed to delete category. Please try again.');
      return false;
    }
  };

  return {
    categoryToDelete,
    setCategoryToDelete,
    deleteSelectedCategory
  };
}
