
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryActions } from '@/components/categories/CategoryActions';
import { DeleteCategoryDialog } from '@/components/categories/DeleteCategoryDialog';
import { useCategoriesData } from '@/hooks/categories/useCategoriesData';
import { useCategoryDelete } from '@/hooks/categories/useCategoryDelete';
import { useCategoryOperations } from '@/hooks/categories/useCategoryOperations';
import { CategoryFormSchema } from '@/components/categories/categoryFormSchema';
import { CategoryFormManager } from '@/components/categories/CategoryFormManager';

type CategoriesTabProps = {
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
};

const CategoriesTab = ({ clientId, viewMode = 'user' }: CategoriesTabProps) => {
  const { user, isUserActive } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryFormSchema | null>(null);
  
  // Use client ID if in consultor view mode
  const userId = viewMode === 'consultor' && clientId ? clientId : user?.id;
  
  // Fetch categories for the user or client
  const { 
    categories, 
    loading, 
    refetchCategories 
  } = useCategoriesData(userId);
  
  // Deletion dialog state and handlers
  const { 
    categoryToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteRequest,
    handleConfirmDelete
  } = useCategoryDelete({ onSuccess: refetchCategories });
  
  // Category form operations (add/edit)
  const {
    handleAddNew,
    handleEdit,
    handleFormClose,
    handleFormSubmit
  } = useCategoryOperations({
    setIsFormOpen,
    setEditingCategory,
    refetchCategories,
    isUserActive: isUserActive(),
    viewMode
  });
  
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
        loading={loading}
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
        userId={userId}
      />
      
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        categoryId={categoryToDelete}
      />
    </div>
  );
};

export default CategoriesTab;
