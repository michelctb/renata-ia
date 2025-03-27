
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { parse, startOfMonth, endOfMonth, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChartDrilldownProps {
  onDateRangeChange?: (dateRange: DateRange) => void;
  onCategoryFilterChange?: (category: string | null) => void;
}

export function useChartDrilldown({ 
  onDateRangeChange,
  onCategoryFilterChange
}: ChartDrilldownProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Função para quando o usuário clica em uma barra no gráfico mensal
  const handleMonthClick = (monthYear: string) => {
    if (!onDateRangeChange) return;
    
    try {
      // Converte o formato "Mmm/yyyy" para uma data
      // Ex: "Mai/2023" -> 01/05/2023
      const dateParts = monthYear.split('/');
      const monthStr = dateParts[0]; // Ex: "Mai"
      const year = parseInt(dateParts[1], 10); // Ex: 2023
      
      // Encontrar índice do mês a partir da abreviação
      const monthIndex = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
                         'jul', 'ago', 'set', 'out', 'nov', 'dez']
                         .findIndex(m => monthStr.toLowerCase().startsWith(m));
      
      if (monthIndex === -1) throw new Error(`Mês inválido: ${monthStr}`);
      
      // Criar primeiro e último dia do mês
      const firstDayOfMonth = startOfMonth(new Date(year, monthIndex));
      const lastDayOfMonth = endOfMonth(new Date(year, monthIndex));
      
      // Atualizar DateRange
      onDateRangeChange({
        from: firstDayOfMonth,
        to: lastDayOfMonth
      });
      
      // Atualizar estado para mostrar o mês selecionado
      setSelectedMonth(monthYear);
      
      console.log(`Filtro aplicado: ${monthYear} (${format(firstDayOfMonth, 'dd/MM/yyyy')} - ${format(lastDayOfMonth, 'dd/MM/yyyy')})`);
    } catch (error) {
      console.error('Erro ao processar clique no mês:', error);
    }
  };
  
  // Função para quando o usuário clica em uma categoria
  const handleCategoryClick = (category: string) => {
    if (!onCategoryFilterChange) return;
    
    // Se a categoria já está selecionada, limpa o filtro
    if (selectedCategory === category) {
      setSelectedCategory(null);
      onCategoryFilterChange(null);
      console.log('Filtro de categoria removido');
    } else {
      // Caso contrário, aplica o filtro
      setSelectedCategory(category);
      onCategoryFilterChange(category);
      console.log(`Filtro aplicado: categoria ${category}`);
    }
  };
  
  // Limpar todos os filtros de drill-down
  const clearAllDrilldownFilters = () => {
    if (selectedMonth && onDateRangeChange) {
      // Reset date range to default (current month)
      const today = new Date();
      const firstDayOfMonth = startOfMonth(today);
      const lastDayOfMonth = endOfMonth(today);
      
      onDateRangeChange({
        from: firstDayOfMonth,
        to: lastDayOfMonth
      });
      
      setSelectedMonth(null);
    }
    
    if (selectedCategory && onCategoryFilterChange) {
      onCategoryFilterChange(null);
      setSelectedCategory(null);
    }
  };
  
  return {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  };
}
