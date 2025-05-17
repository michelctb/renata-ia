
import { useState, useCallback, useEffect } from 'react';
import { DateRange } from 'react-day-picker';

type UseChartDrilldownProps = {
  onCategoryFilterChange?: (category: string | null) => void;
};

/**
 * Hook para gerenciar os filtros de drill-down nos gráficos
 */
export function useChartDrilldown({
  onCategoryFilterChange
}: UseChartDrilldownProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  /**
   * Lida com clique em uma categoria no gráfico de pizza
   */
  const handleCategoryClick = useCallback((category: string) => {
    // Se a categoria clicada já está selecionada, remove o filtro
    if (selectedCategory === category) {
      setSelectedCategory(null);
      if (onCategoryFilterChange) {
        onCategoryFilterChange(null);
      }
      return;
    }
    
    // Caso contrário, aplica o filtro
    setSelectedCategory(category);
    
    // Notifica o componente pai sobre a mudança
    if (onCategoryFilterChange) {
      onCategoryFilterChange(category);
    }
  }, [selectedCategory, onCategoryFilterChange]);
  
  /**
   * Limpar todos os filtros de drill-down
   */
  const clearAllDrilldownFilters = useCallback(() => {
    setSelectedCategory(null);
    
    // Notificar os callbacks
    if (onCategoryFilterChange) {
      onCategoryFilterChange(null);
    }
  }, [onCategoryFilterChange]);

  // Log inicial apenas na primeira renderização
  useEffect(() => {
    console.log('useChartDrilldown - Inicializado com callbacks:', { 
      hasCategoryCallback: !!onCategoryFilterChange
    });
  }, []);

  return {
    selectedCategory,
    handleCategoryClick,
    clearAllDrilldownFilters
  };
}
