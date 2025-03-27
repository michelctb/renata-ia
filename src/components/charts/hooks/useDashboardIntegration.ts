
import { useCallback } from 'react';
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
    if (setDateRange) {
      console.log('Aplicando filtro de data:', {
        de: newDateRange.from?.toISOString(),
        ate: newDateRange.to?.toISOString()
      });
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

  return {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  };
}
