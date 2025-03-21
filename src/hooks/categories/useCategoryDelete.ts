
import { useState } from 'react';
import { toast } from 'sonner';
import { Category, deleteCategory } from '@/lib/categories';
import { MetaCategoria, deleteMetaCategoria } from '@/lib/metas';

interface CategoryDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage category deletion
 */
export function useCategoryDelete({ onSuccess }: CategoryDeleteProps = {}) {
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleDeleteRequest = (id: number) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete);
      toast.success('Categoria excluída com sucesso!');
      
      // Close dialog
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erro ao excluir categoria. Tente novamente.');
    }
  };

  return {
    categoryToDelete,
    setCategoryToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteRequest,
    handleConfirmDelete
  };
}
