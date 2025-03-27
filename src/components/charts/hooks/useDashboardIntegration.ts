
import { useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { useChartDrilldown } from './useChartDrilldown';

type UseDashboardIntegrationProps = {
  setDateRange?: (dateRange: DateRange) => void;
};

/**
 * Hook para gerenciar a integração do dashboard com drill-down e outros componentes
 */
export function useDashboardIntegration({
  setDateRange
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
    onCategoryFilterChange: () => {} // Usamos o estado interno do hook
  });

  // Log de mudanças para debug
  useEffect(() => {
    console.log('DashboardIntegration - Categoria selecionada mudou para:', selectedCategory);
  }, [selectedCategory]);

  return {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  };
}
