import { useState } from 'react';
import { toast } from 'sonner';
import { CategoryFormSchema } from '@/components/categories/categoryFormSchema';

interface CategoryOperationsProps {
  setIsFormOpen: (open: boolean) => void;
  setEditingCategory: (category: CategoryFormSchema | null) => void;
  refetchCategories: () => void;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export const useCategoryOperations = ({
  setIsFormOpen,
  setEditingCategory,
  refetchCategories,
  isUserActive,
  viewMode = 'user'
}: CategoryOperationsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handler for opening the form to add a new category
  const handleAddNew = () => {
    if (!isUserActive) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar categorias.');
      return;
    }
    
    if (viewMode === 'consultor') {
      toast.error('Você não tem permissão para adicionar categorias para este cliente.');
      return;
    }
    
    setEditingCategory(null);
    setIsFormOpen(true);
  };
  
  // Handler for opening the form to edit an existing category
  const handleEdit = (category: CategoryFormSchema) => {
    if (!isUserActive) {
      toast.error('Sua assinatura está inativa. Você não pode editar categorias.');
      return;
    }
    
    if (viewMode === 'consultor') {
      toast.error('Você não tem permissão para editar categorias deste cliente.');
      return;
    }
    
    setEditingCategory(category);
    setIsFormOpen(true);
  };
  
  // Handler for closing the form
  const handleFormClose = () => {
    setIsFormOpen(false);
    // Clear editing state after a brief delay to prevent UI flicker
    setTimeout(() => {
      setEditingCategory(null);
    }, 100);
  };
  
  // Handler for submitting the form
  const handleFormSubmit = async (formData: CategoryFormSchema) => {
    setIsProcessing(true);
    
    try {
      // Call the API to add/update category
      // ...
      
      // Refetch categories to update the list
      refetchCategories();
      
      // Close the form
      setIsFormOpen(false);
      
      // Show success message
      toast.success(
        formData.id ? 'Categoria atualizada com sucesso!' : 'Categoria adicionada com sucesso!'
      );
    } catch (error) {
      console.error('Error submitting category form:', error);
      toast.error('Erro ao salvar categoria. Tente novamente.');
    } finally {
      setIsProcessing(false);
      
      // Clear editing state after a brief delay
      setTimeout(() => {
        setEditingCategory(null);
      }, 100);
    }
  };
  
  return {
    isProcessing,
    handleAddNew,
    handleEdit,
    handleFormClose,
    handleFormSubmit
  };
};
