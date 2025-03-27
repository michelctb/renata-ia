
import { useEffect } from 'react';
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
  // Usar o hook de drill-down para gerenciar filtros interativos
  const {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  } = useChartDrilldown({
    onDateRangeChange: setDateRange,
    onCategoryFilterChange
  });

  // Log de mudanças para debug
  useEffect(() => {
    console.log('DashboardIntegration - Categoria selecionada mudou para:', selectedCategory);
    
    // Notificar componente pai sobre a mudança na categoria selecionada
    if (onCategoryFilterChange) {
      onCategoryFilterChange(selectedCategory);
    }
  }, [selectedCategory, onCategoryFilterChange]);

  return {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  };
}
