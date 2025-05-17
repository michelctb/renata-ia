
import React from 'react';
import { ActiveFilters } from '../ActiveFilters';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';

type UseDashboardUIProps = {
  selectedCategory: string | null;
  handleCategoryClick: (category: string) => void;
  clearAllDrilldownFilters: () => void;
};

/**
 * Hook para gerenciar elementos de UI do dashboard
 */
export function useDashboardUI({
  selectedCategory,
  handleCategoryClick,
  clearAllDrilldownFilters
}: UseDashboardUIProps) {
  // Renderizar os filtros ativos
  const renderActiveFilters = () => {
    if (!selectedCategory) return null;
    
    return (
      <ActiveFilters
        selectedCategory={selectedCategory}
        onClearCategory={() => {
          if (selectedCategory) {
            handleCategoryClick(selectedCategory);  // Clicando novamente na mesma categoria remove o filtro
          }
        }}
        onClearAll={clearAllDrilldownFilters}
      />
    );
  };

  return {
    renderActiveFilters
  };
}
