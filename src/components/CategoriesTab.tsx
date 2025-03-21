
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import { CategoryList } from './categories/CategoryList';
import { DeleteCategoryDialog } from './categories/DeleteCategoryDialog';
import { CategoryFormManager } from './categories/CategoryFormManager';
import { CategoryActions } from './categories/CategoryActions';
import { useCategories } from '@/hooks/categories';

const CategoriesTab = () => {
  const { isUserActive } = useAuth();
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const {
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
  } = useCategories();

  const handleEdit = (category: Category, meta: MetaCategoria | null) => {
    // Block inactive users from editing categories
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode editar categorias.');
      return;
    }
    
    setEditingCategory(category);
    setEditingMeta(meta);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteRequest = (id: number, isPadrao: boolean) => {
    // Block inactive users from deleting categories
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode excluir categorias.');
      return;
    }
    
    if (isPadrao) {
      toast.error('Categorias padrão não podem ser excluídas.');
      return;
    }
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const success = await deleteSelectedCategory();
    if (success) {
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setEditingMeta(null);
    setIsCategoryFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
    setEditingMeta(null);
  };

  return (
    <div className="p-4">
      <CategoryActions 
        onAddNew={handleAddNew}
        isUserActive={isUserActive()}
      />

      <CategoryList
        categories={categories}
        metas={metas}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        isLoading={isLoading}
        isUserActive={isUserActive()}
      />

      <CategoryFormManager
        editingCategory={editingCategory}
        editingMeta={editingMeta}
        isOpen={isCategoryFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitCategory}
      />

      <DeleteCategoryDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CategoriesTab;
