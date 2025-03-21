
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
import {
  MetaCategoria,
  fetchMetasCategorias,
  addMetaCategoria,
  updateMetaCategoria,
  deleteMetaCategoria
} from '@/lib/metas';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import CategoryForm from './CategoryForm';
import { CategoryList } from './categories/CategoryList';
import { DeleteCategoryDialog } from './categories/DeleteCategoryDialog';
import { getMonth, getYear } from 'date-fns';

const CategoriesTab = () => {
  const { user, isUserActive } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [metas, setMetas] = useState<Record<string, MetaCategoria>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMeta, setEditingMeta] = useState<MetaCategoria | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Carrega categorias e metas
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Carregar categorias
        const categoriesData = await fetchCategories(user.id);
        setCategories(categoriesData);
        
        // Carregar metas
        const metasData = await fetchMetasCategorias(user.id);
        
        // Organizar metas por nome de categoria
        const metasByCategory: Record<string, MetaCategoria> = {};
        metasData.forEach(meta => {
          metasByCategory[meta.categoria] = meta;
        });
        
        setMetas(metasByCategory);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar os dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

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
    if (!categoryToDelete) return;
    
    try {
      // Encontrar a categoria pelo ID
      const categoryToDeleteObj = categories.find(c => c.id === categoryToDelete);
      
      if (categoryToDeleteObj) {
        // Verificar se a categoria tem meta e excluí-la primeiro
        const metaToDelete = metas[categoryToDeleteObj.nome];
        if (metaToDelete && metaToDelete.id) {
          await deleteMetaCategoria(metaToDelete.id);
          
          // Atualizar estado de metas
          const newMetas = { ...metas };
          delete newMetas[categoryToDeleteObj.nome];
          setMetas(newMetas);
        }
      }
      
      // Excluir a categoria
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

  const handleSubmitCategory = async (
    category: Category, 
    metaData?: { hasMeta: boolean, valorMeta?: number }
  ) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar categorias');
      return;
    }
    
    try {
      let savedCategory;
      
      // Para categorias padrão, apenas atualizamos a meta, não a categoria em si
      if (category.id && category.padrao) {
        // Para categorias padrão, usamos os dados existentes
        const existingCategory = categories.find(c => c.id === category.id);
        if (!existingCategory) {
          throw new Error('Categoria não encontrada');
        }
        savedCategory = existingCategory;
      } else {
        // Para categorias não padrão, salvamos ou atualizamos normalmente
        if (category.id) {
          savedCategory = await updateCategory(category);
          setCategories(prev => 
            prev.map(c => (c.id === category.id ? savedCategory : c))
          );
        } else {
          const categoryToAdd: Category = {
            ...category,
            cliente: user.id,
            padrao: false
          };
          
          savedCategory = await addCategory(categoryToAdd);
          setCategories(prev => [...prev, savedCategory]);
        }
      }
      
      // Gerenciar meta
      if (metaData) {
        const existingMeta = metas[savedCategory.nome];
        
        if (metaData.hasMeta && metaData.valorMeta) {
          // Criar ou atualizar meta
          const metaToSave: MetaCategoria = {
            id: existingMeta?.id,
            id_cliente: user.id,
            categoria: savedCategory.nome,
            valor_meta: metaData.valorMeta,
            periodo: 'mensal',
            mes_referencia: getMonth(new Date()) + 1,
            ano_referencia: getYear(new Date())
          };
          
          let savedMeta;
          if (existingMeta?.id) {
            savedMeta = await updateMetaCategoria(metaToSave);
          } else {
            savedMeta = await addMetaCategoria(metaToSave);
          }
          
          // Atualizar estado das metas
          setMetas(prev => ({
            ...prev,
            [savedCategory.nome]: savedMeta
          }));
        } 
        else if (!metaData.hasMeta && existingMeta?.id) {
          // Remover meta existente
          await deleteMetaCategoria(existingMeta.id);
          
          // Atualizar estado das metas
          const newMetas = { ...metas };
          delete newMetas[savedCategory.nome];
          setMetas(newMetas);
        }
      }
      
      toast.success(
        category.id
          ? 'Categoria atualizada com sucesso!'
          : 'Categoria adicionada com sucesso!'
      );
      
      handleCloseForm();
    } catch (error) {
      console.error('Erro com categoria:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao salvar a categoria: ${errorMessage}`);
    }
  };

  const handleAddNew = () => {
    // Block inactive users from adding categories
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar categorias.');
      return;
    }
    
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
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Categorias e Metas</h2>
        <Button onClick={handleAddNew} disabled={!isUserActive()}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Nova Categoria
        </Button>
      </div>

      <CategoryList
        categories={categories}
        metas={metas}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        isLoading={isLoading}
        isUserActive={isUserActive()}
      />

      {user && (
        <CategoryForm
          isOpen={isCategoryFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitCategory}
          editingCategory={editingCategory}
          meta={editingMeta}
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
