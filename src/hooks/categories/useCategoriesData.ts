
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Category, fetchCategories } from '@/lib/categories';
import { MetaCategoria, fetchMetasCategorias } from '@/lib/metas';

interface UseCategoriesDataProps {
  userId?: string;
}

/**
 * Hook to manage categories and metas data loading
 */
export function useCategoriesData(userId?: string) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [metas, setMetas] = useState<Record<string, MetaCategoria>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the provided userId or fallback to the authenticated user
  const effectiveUserId = userId || user?.id;

  // Function to load data
  const loadData = useCallback(async () => {
    if (!effectiveUserId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Load categories
      const categoriesData = await fetchCategories(effectiveUserId);
      setCategories(categoriesData);
      
      // Load metas
      const metasData = await fetchMetasCategorias(effectiveUserId);
      
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
  }, [effectiveUserId]);
  
  // Load data on mount and when userId changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    user,
    categories,
    setCategories,
    metas,
    setMetas,
    isLoading,
    refetchCategories: loadData
  };
}
