
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Category, 
  fetchCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import CategoryForm from './CategoryForm';
import { CategoryList } from './categories/CategoryList';
import { DeleteCategoryDialog } from './categories/DeleteCategoryDialog';

const CategoriesTab = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await fetchCategories(user.id);
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar as categorias. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, [user]);

  const handleEdit = (category: Category) => {
    if (category.padrao) {
      toast.error('Categorias padrão não podem ser editadas.');
      return;
    }
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteRequest = (id: number, isPadrao: boolean) => {
    if (isPadrao) {
      toast.error('Categorias padrão não podem ser excluídas.');
      return;
    }
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete);
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete));
      toast.success('Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir a categoria. Tente novamente.');
    } finally {
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmitCategory = async (category: Category) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar categorias');
      return;
    }
    
    try {
      if (category.id) {
        const existingCategory = categories.find(c => c.id === category.id);
        if (existingCategory?.padrao) {
          throw new Error('Categorias padrão não podem ser editadas');
        }

        const updated = await updateCategory(category);
        setCategories(prev => 
          prev.map(c => (c.id === category.id ? updated : c))
        );
        toast.success('Categoria atualizada com sucesso!');
      } else {
        const categoryToAdd: Category = {
          ...category,
          cliente: user.id,
          padrao: false
        };
        
        const added = await addCategory(categoryToAdd);
        setCategories(prev => [...prev, added]);
        toast.success('Categoria adicionada com sucesso!');
      }
      handleCloseForm();
    } catch (error) {
      console.error('Erro com categoria:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao salvar a categoria: ${errorMessage}`);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Nova Categoria
        </Button>
      </div>

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        isLoading={isLoading}
      />

      {user && (
        <CategoryForm
          isOpen={isCategoryFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitCategory}
          editingCategory={editingCategory}
          userId={user.id}
        />
      )}

      <DeleteCategoryDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CategoriesTab;
