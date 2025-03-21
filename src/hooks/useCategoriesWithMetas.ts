
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import { fetchCategories } from '@/lib/categories';
import { fetchMetasCategorias } from '@/lib/metas';

export type CategoryWithMeta = {
  category: Category;
  hasMeta: boolean;
  meta?: MetaCategoria;
};

/**
 * Custom hook that connects categories with their corresponding metas.
 * Fetches all active categories for a user and checks if they have metas set.
 * 
 * @param {string | undefined} userId - The ID of the current user
 * @returns {Object} Object containing categories with meta information and loading state
 * @property {CategoryWithMeta[]} categoriesWithMetas - List of categories with meta information
 * @property {boolean} isLoading - Whether the data is currently loading
 * @property {Function} refreshData - Function to refresh the data
 */
export function useCategoriesWithMetas(userId: string | undefined) {
  const [categoriesWithMetas, setCategoriesWithMetas] = useState<CategoryWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all categories
      const categories = await fetchCategories(userId);
      
      // Filter to expense categories (saída or ambos)
      const expenseCategories = categories.filter(
        cat => cat.tipo === 'saída' || cat.tipo === 'ambos'
      );

      // Fetch all metas for the user
      const metas = await fetchMetasCategorias(userId);

      // Map categories with their meta information
      const result = expenseCategories.map(category => {
        const matchingMeta = metas.find(meta => meta.categoria === category.nome);
        return {
          category,
          hasMeta: !!matchingMeta,
          meta: matchingMeta,
        };
      });

      setCategoriesWithMetas(result);
    } catch (error) {
      console.error('Error loading categories with metas:', error);
      toast.error('Erro ao carregar categorias e metas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  return {
    categoriesWithMetas,
    isLoading,
    refreshData: loadData
  };
}
