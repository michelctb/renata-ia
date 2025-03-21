
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryActions } from '@/components/categories/CategoryActions';
import { DeleteCategoryDialog } from '@/components/categories/DeleteCategoryDialog';
import { useCategoriesData } from '@/hooks/categories/useCategoriesData';
import { CategoryFormManager } from '@/components/categories/CategoryFormManager';
import { CategoryFormValues } from '@/components/categories/categoryFormSchema';
import { Category } from '@/lib/categories';

type CategoriesTabProps = {
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
};

const CategoriesTab = ({ clientId, viewMode = 'user' }: CategoriesTabProps) => {
  const { user, isUserActive } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryFormValues | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  
  // Use client ID if in consultor view mode
  const userId = viewMode === 'consultor' && clientId ? clientId : user?.id;
  
  // Fetch categories for the user or client
  const { 
    categories, 
    isLoading
  } = useCategoriesData(userId);
  
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
    // Handle form submission logic
    
    // Close form
    setIsFormOpen(false);
    
    // Clear editing state
    setTimeout(() => {
      setEditingCategory(null);
    }, 100);
  };
  
  // Handle delete request
  const handleDeleteRequest = (id: number) => {
    if (!isUserActive()) {
      return;
    }
    
    if (viewMode === 'consultor') {
      return;
    }
    
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = async () => {
    // Handle delete logic
    
    // Close dialog
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
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
