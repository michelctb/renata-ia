
import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';

type UseChartDrilldownProps = {
  onDateRangeChange?: (dateRange: DateRange) => void;
  onCategoryFilterChange?: (category: string | null) => void;
};

/**
 * Hook para gerenciar os filtros de drill-down nos gráficos
 */
export function useChartDrilldown({
  onDateRangeChange,
  onCategoryFilterChange
}: UseChartDrilldownProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  /**
   * Lida com clique em um mês no gráfico de barras
   */
  const handleMonthClick = useCallback((month: string) => {
    console.log('Mês clicado:', month);
    
    // Se já está selecionado, desseleciona
    if (selectedMonth === month) {
      console.log('Removendo filtro de mês');
      setSelectedMonth(null);
      
      // Atualiza o dateRange para o mês atual
      if (onDateRangeChange) {
        const today = new Date();
        const firstDayOfMonth = startOfMonth(today);
        const lastDayOfMonth = endOfMonth(today);
        onDateRangeChange({
          from: firstDayOfMonth,
          to: lastDayOfMonth
        });
      }
      return;
    }
    
    setSelectedMonth(month);
    
    // Converter nome do mês para número
    const monthMap: Record<string, number> = {
      'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3, 'Mai': 4, 'Jun': 5,
      'Jul': 6, 'Ago': 7, 'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11
    };
    
    // Atualizar o dateRange para o mês clicado
    if (onDateRangeChange && month in monthMap) {
      const monthNumber = monthMap[month];
      const year = new Date().getFullYear();
      const firstDay = new Date(year, monthNumber, 1);
      const lastDay = endOfMonth(firstDay);
      
      console.log('Atualizando dateRange para:', firstDay, 'até', lastDay);
      onDateRangeChange({
        from: firstDay,
        to: lastDay
      });
    }
  }, [selectedMonth, onDateRangeChange]);
  
  /**
   * Lida com clique em uma categoria no gráfico de pizza
   */
  const handleCategoryClick = useCallback((category: string) => {
    console.log('Categoria clicada:', category);
    console.log('Categoria selecionada anteriormente:', selectedCategory);
    
    // Se a categoria clicada já está selecionada, remove o filtro
    if (selectedCategory === category) {
      console.log('Removendo filtro de categoria');
      setSelectedCategory(null);
      if (onCategoryFilterChange) {
        onCategoryFilterChange(null);
      }
      return;
    }
    
    // Caso contrário, aplica o filtro
    console.log('Aplicando filtro de categoria:', category);
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
    setSelectedMonth(null);
    setSelectedCategory(null);
    
    // Notificar os callbacks
    if (onDateRangeChange) {
      const today = new Date();
      onDateRangeChange({
        from: startOfMonth(today),
        to: endOfMonth(today)
      });
    }
    
    if (onCategoryFilterChange) {
      onCategoryFilterChange(null);
    }
  }, [onDateRangeChange, onCategoryFilterChange]);

  return {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  };
}
