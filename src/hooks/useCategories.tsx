
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
import { getMonth, getYear } from 'date-fns';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [metas, setMetas] = useState<Record<string, MetaCategoria>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMeta, setEditingMeta] = useState<MetaCategoria | null>(null);
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
      
      // Para categorias padrão, apenas gerenciamos a meta, não a categoria em si
      if (category.padrao) {
        console.log('Categoria padrão, mantendo dados existentes e atualizando apenas meta');
        // Para categorias padrão, usamos os dados existentes
        savedCategory = categories.find(c => c.id === category.id);
        if (!savedCategory) {
          throw new Error('Categoria padrão não encontrada');
        }
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
      
      return true;
    } catch (error) {
      console.error('Erro com categoria:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao salvar a categoria: ${errorMessage}`);
      return false;
    }
  };

  const deleteSelectedCategory = async () => {
    if (!categoryToDelete) return false;
    
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
      return true;
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir a categoria. Tente novamente.');
      return false;
    }
  };

  return {
    user,
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
  };
}
