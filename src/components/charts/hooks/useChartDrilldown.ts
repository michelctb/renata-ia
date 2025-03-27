
import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
        
        console.log('Resetando dateRange para o mês atual:', 
          { from: firstDayOfMonth, to: lastDayOfMonth });
          
        onDateRangeChange({
          from: firstDayOfMonth,
          to: lastDayOfMonth
        });
      }
      return;
    }
    
    setSelectedMonth(month);
    
    // Extrair mês e ano do formato "Mmm/yyyy"
    const [monthAbbr, yearStr] = month.split('/');
    if (!monthAbbr || !yearStr) {
      console.error('Formato de mês inválido:', month);
      return;
    }
    
    const year = parseInt(yearStr, 10);
    if (isNaN(year)) {
      console.error('Ano inválido:', yearStr);
      return;
    }
    
    try {
      // Criar uma data para o primeiro dia do mês
      const monthDate = parse(`01 ${monthAbbr} ${year}`, 'dd MMM yyyy', new Date(), { locale: ptBR });
      
      if (isNaN(monthDate.getTime())) {
        throw new Error('Data inválida');
      }
      
      const firstDay = startOfMonth(monthDate);
      const lastDay = endOfMonth(monthDate);
      
      console.log('Atualizando dateRange para:', 
        { month, firstDay: firstDay.toISOString(), lastDay: lastDay.toISOString() });
      
      // Atualizar o dateRange para o mês clicado
      if (onDateRangeChange) {
        onDateRangeChange({
          from: firstDay,
          to: lastDay
        });
      }
    } catch (error) {
      console.error('Erro ao processar data do mês:', month, error);
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
