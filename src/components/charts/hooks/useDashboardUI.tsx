
import React from 'react';
import { ActiveFilters } from '../ActiveFilters';
import { Transaction } from '@/lib/supabase';

type UseDashboardUIProps = {
  selectedMonth: string | null;
  selectedCategory: string | null;
  handleMonthClick: (month: string) => void;
  handleCategoryClick: (category: string) => void;
  clearAllDrilldownFilters: () => void;
  setDateRange?: (dateRange: any) => void;
};

/**
 * Hook para renderizar elementos de UI do dashboard
 */
export function useDashboardUI({
  selectedMonth,
  selectedCategory,
  handleMonthClick,
  handleCategoryClick,
  clearAllDrilldownFilters,
  setDateRange
}: UseDashboardUIProps) {
  // Renderizar os filtros ativos
  const renderActiveFilters = () => {
    // Se não temos como alterar o dateRange, não mostramos o filtro de mês
    if (!setDateRange && !selectedCategory) return null;
    
    return (
      <ActiveFilters
        selectedMonth={selectedMonth}
        selectedCategory={selectedCategory}
        onClearMonth={() => {
          if (setDateRange) {
            handleMonthClick(selectedMonth!);  // Clicando novamente no mesmo mês remove o filtro
          }
        }}
        onClearCategory={() => {
          handleCategoryClick(selectedCategory!);  // Clicando novamente na mesma categoria remove o filtro
        }}
        onClearAll={clearAllDrilldownFilters}
      />
    );
  };

  return {
    renderActiveFilters
  };
}
