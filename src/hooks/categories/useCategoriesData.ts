
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Category, fetchCategories } from '@/lib/categories';
import { MetaCategoria, fetchMetasCategorias } from '@/lib/metas';

/**
 * Hook to manage categories and metas data loading
 */
export function useCategoriesData() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [metas, setMetas] = useState<Record<string, MetaCategoria>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load categories and metas
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Load categories
        const categoriesData = await fetchCategories(user.id);
        setCategories(categoriesData);
        
        // Load metas
        const metasData = await fetchMetasCategorias(user.id);
        
        // Organize metas by category name
        const metasByCategory: Record<string, MetaCategoria> = {};
        metasData.forEach(meta => {
          metasByCategory[meta.categoria] = meta;
        });
        
        setMetas(metasByCategory);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load categories. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  return {
    user,
    categories,
    setCategories,
    metas,
    setMetas,
    isLoading
  };
}
