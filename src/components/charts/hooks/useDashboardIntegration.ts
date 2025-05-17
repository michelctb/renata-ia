
import { useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { useChartDrilldown } from './useChartDrilldown';

type UseDashboardIntegrationProps = {
  onCategoryFilterChange?: (category: string | null) => void;
};

/**
 * Hook para gerenciar a integração do dashboard com drill-down e outros componentes
 */
export function useDashboardIntegration({
  onCategoryFilterChange
}: UseDashboardIntegrationProps) {
  // Usar o hook de drill-down para gerenciar filtros interativos
  const {
    selectedCategory,
    handleCategoryClick,
    clearAllDrilldownFilters
  } = useChartDrilldown({
    onCategoryFilterChange
  });

  return {
    selectedCategory,
    handleCategoryClick,
    clearAllDrilldownFilters
  };
}
