
import { DateRange } from 'react-day-picker';
import { MonthlyTotalItem } from './types';
import { getMonthKeyFromDate, formatMonthForDisplay, sortMonthlyData, isDateInFilterRange, monthKeyToDisplay } from './dateUtils';

// Processa os dados de transações para o formato mensal
export const processMonthlyTotals = (
  transactions: any[],
  dateRange: DateRange | undefined | null,
  respectDateFilter: boolean
): MonthlyTotalItem[] => {
  try {
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    // Objeto para mapear meses e acumular valores
    const monthMap: Record<string, {
      receitas: number;
      despesas: number;
      isInDateRange: boolean;
    }> = {};
    
    // Primeiro passo: acumular valores por mês
    transactions.forEach(transaction => {
      try {
        const { data, valor, operação } = transaction;
        
        if (!data) return;
        
        // Obter a chave e display do mês
        const monthKey = getMonthKeyFromDate(data);
        if (!monthKey) return;
        
        // Verificar se está no range de datas
        const inDateRange = isDateInFilterRange(data, dateRange);
        
        // Inicializar o mês se necessário
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = {
            receitas: 0,
            despesas: 0,
            isInDateRange: inDateRange
          };
        } else if (inDateRange) {
          // Se qualquer transação do mês estiver no range, marcar o mês como dentro do range
          monthMap[monthKey].isInDateRange = true;
        }
        
        // Respeitar o filtro de data se solicitado
        if (respectDateFilter && !inDateRange) return;
        
        // Acumular valores por tipo de operação
        const numericValue = parseFloat(valor) || 0;
        
        if (operação === 'entrada') {
          monthMap[monthKey].receitas += numericValue;
        } else if (operação === 'saída') {
          monthMap[monthKey].despesas += numericValue;
        }
      } catch (error) {
        console.error('Erro ao processar transação mensal:', error);
      }
    });
    
    // Ordenar as chaves dos meses
    const sortedMonthKeys = sortMonthlyData(Object.keys(monthMap));
    
    // Segundo passo: transformar em array de resultados
    return sortedMonthKeys.map(monthKey => {
      const { receitas, despesas, isInDateRange } = monthMap[monthKey];
      const balance = receitas - despesas;
      
      return {
        month: monthKeyToDisplay(monthKey),
        monthKey,
        receitas,
        despesas,
        balance,
        isInDateRange
      };
    });
  } catch (error) {
    console.error('Erro ao processar totais mensais:', error);
    return [];
  }
};
