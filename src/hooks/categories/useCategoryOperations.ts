
import { toast } from 'sonner';
import { getMonth, getYear } from 'date-fns';
import { Category, addCategory, updateCategory } from '@/lib/categories';
import { MetaCategoria, addMetaCategoria, updateMetaCategoria, deleteMetaCategoria } from '@/lib/metas';

type CategoryOperationsProps = {
  user: { id: string } | null;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  metas: Record<string, MetaCategoria>;
  setMetas: React.Dispatch<React.SetStateAction<Record<string, MetaCategoria>>>;
};

/**
 * Hook to manage category creation and updates
 */
export function useCategoryOperations({ 
  user, 
  categories, 
  setCategories, 
  metas, 
  setMetas 
}: CategoryOperationsProps) {
  
  const handleSubmitCategory = async (
    category: Category, 
    metaData?: { hasMeta: boolean, valorMeta?: number }
  ): Promise<void> => {
    if (!user) {
      toast.error('You must be logged in to add categories');
      return;
    }
    
    try {
      let savedCategory;
      
      // For default categories, only manage the goal/meta, not the category itself
      if (category.padrao) {
        console.log('Default category, maintaining existing data and only updating meta');
        // For default categories, use existing data
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
      
      // Manage meta
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
          ? 'Category updated successfully!'
          : 'Category added successfully!'
      );
    } catch (error) {
      console.error('Error with category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error saving category: ${errorMessage}`);
      throw error;
    }
  };

  return { handleSubmitCategory };
}
