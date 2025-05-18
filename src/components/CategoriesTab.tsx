
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryActions } from '@/components/categories/CategoryActions';
import { DeleteCategoryDialog } from '@/components/categories/DeleteCategoryDialog';
import { useCategories } from '@/hooks/categories';
import { CategoryFormManager } from '@/components/categories/CategoryFormManager';
import { z } from 'zod';
import { categoryFormSchema } from '@/components/categories/categoryFormSchema';

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

type CategoriesTabProps = {
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
};

const CategoriesTab = ({ clientId, viewMode = 'user' }: CategoriesTabProps) => {
  const { user, isUserActive } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryFormValues | null>(null);
  
  // Use client ID if in consultor view mode
  const userId = viewMode === 'consultor' && clientId ? clientId : user?.id;
  
  // Get categories hook with all operations
  const { 
    categories, 
    metas,
    isLoading,
    refetchCategories,
    handleSubmitCategory,
    deleteDialogOpen,
    setDeleteDialogOpen,
    categoryToDelete,
    setCategoryToDelete,
    handleDeleteRequest,
    handleConfirmDelete
  } = useCategories(userId);
  
  // Handle adding a new category
  const handleAddNew = () => {
    if (!isUserActive()) {
      return;
    }
    
    if (viewMode === 'consultor') {
      return;
    }
    
    setEditingCategory(null);
    setIsFormOpen(true);
  };
  
  // Handle editing a category
  const handleEdit = (category: CategoryFormValues) => {
    if (!isUserActive()) {
      return;
    }
    
    if (viewMode === 'consultor') {
      return;
    }
    
    setEditingCategory(category);
    setIsFormOpen(true);
  };
  
  // Handle closing the form
  const handleFormClose = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingCategory(null);
    }, 100);
  };
  
  // Handle form submission
  const handleFormSubmit = async (formData: CategoryFormValues) => {
    // Agora não precisamos passar meta information, apenas a categoria
    const success = await handleSubmitCategory({
      id: formData.id,
      nome: formData.nome,
      tipo: formData.tipo,
      cliente: userId || '',
      padrao: false // Não está mais relacionado a metas
    });
    
    if (success) {
      // Close form
      setIsFormOpen(false);
      
      // Clear editing state
      setTimeout(() => {
        setEditingCategory(null);
      }, 100);
      
      // Refresh categories
      refetchCategories();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categorias</h2>
        <CategoryActions 
          onAddNew={handleAddNew} 
          isActive={isUserActive()}
          viewMode={viewMode}
        />
      </div>
      
      <CategoryList 
        categories={categories} 
        metas={metas}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        isUserActive={isUserActive()}
        viewMode={viewMode}
      />
      
      <CategoryFormManager
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingCategory={editingCategory}
      />
      
      <DeleteCategoryDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        categoryId={categoryToDelete}
      />
    </div>
  );
};

export default CategoriesTab;
