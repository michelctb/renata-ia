
import { useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { useChartDrilldown } from './useChartDrilldown';

type UseDashboardIntegrationProps = {
  setDateRange?: (dateRange: DateRange) => void;
  onCategoryFilterChange?: (category: string | null) => void;
};

/**
 * Hook para gerenciar a integração do dashboard com drill-down e outros componentes
 */
export function useDashboardIntegration({
  setDateRange,
  onCategoryFilterChange
}: UseDashboardIntegrationProps) {
  // Adicionar callback de debug para DateRange
  const handleDateRangeChange = useCallback((newDateRange: DateRange) => {
    console.log('useDashboardIntegration - Atualizando DateRange:', newDateRange);
    if (setDateRange) {
      setDateRange(newDateRange);
    }
  }, [setDateRange]);

  // Usar o hook de drill-down para gerenciar filtros interativos
  const {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  } = useChartDrilldown({
    onDateRangeChange: handleDateRangeChange,
    onCategoryFilterChange
  });

  // Log de mudanças para debug
  useEffect(() => {
    console.log('useDashboardIntegration - Categoria selecionada:', selectedCategory);
    console.log('useDashboardIntegration - Callback disponível:', !!onCategoryFilterChange);
    
    // Notificar componente pai sobre a mudança na categoria selecionada
    if (onCategoryFilterChange) {
      onCategoryFilterChange(selectedCategory);
    }
  }, [selectedCategory, onCategoryFilterChange]);
  
  // Log para mudanças no mês selecionado
  useEffect(() => {
    console.log('useDashboardIntegration - Mês selecionado:', selectedMonth);
    console.log('useDashboardIntegration - Callback de DateRange disponível:', !!setDateRange);
  }, [selectedMonth, setDateRange]);

  return {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  };
}
