
import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import { addCategory, updateCategory } from '@/lib/categories';
import { addMetaCategoria, updateMetaCategoria, deleteMetaCategoria } from '@/lib/metas';
import { getMonth, getYear } from 'date-fns';
import { categoryFormSchema } from '@/components/categories/categoryFormSchema';
import { z } from 'zod';

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface UseCategoryOperationsProps {
  user: any;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  metas: Record<string, MetaCategoria>;
  setMetas: React.Dispatch<React.SetStateAction<Record<string, MetaCategoria>>>;
}

/**
 * Hook for category creation and update operations
 */
export function useCategoryOperations({
  user,
  categories,
  setCategories,
  metas,
  setMetas
}: UseCategoryOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle category form submission (create or update)
   */
  const handleSubmitCategory = async (
    category: Category, 
    metaData?: { hasMeta: boolean, valorMeta?: number }
  ) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar categorias');
      return false;
    }
    
    setIsProcessing(true);
    try {
      let savedCategory;
      
      // For default categories, we only manage the goal, not the category itself
      if (category.padrao) {
        console.log('Default category, keeping existing data and only updating meta');
        // For default categories, we use existing data
        savedCategory = categories.find(c => c.id === category.id);
        if (!savedCategory) {
          throw new Error('Default category not found');
        }
      } else {
        // For non-default categories, save or update normally
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
      
      // Manage goal/meta
      if (metaData) {
        const existingMeta = metas[savedCategory.nome];
        
        if (metaData.hasMeta && metaData.valorMeta) {
          // Create or update meta
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
          
          // Update metas state
          setMetas(prev => ({
            ...prev,
            [savedCategory.nome]: savedMeta
          }));
        } 
        else if (!metaData.hasMeta && existingMeta?.id) {
          // Remove existing meta
          await deleteMetaCategoria(existingMeta.id);
          
          // Update metas state
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
      console.error('Error with category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error saving category: ${errorMessage}`);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleSubmitCategory
  };
}
