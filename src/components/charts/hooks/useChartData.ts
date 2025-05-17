
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { useMonthlyChartDataProcessor } from './useMonthlyChartDataProcessor';
import { useFilteredTransactionsByDate } from './useFilteredTransactionsByDate';

/**
 * Hook para preparar dados para gráfico mensal
 */
export const useMonthlyChartData = (transactions: Transaction[] = []) => {
  // Garantir que estamos lidando com arrays válidos
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  // Usar o processador diretamente para evitar problemas com hooks em hooks
  return useMonthlyChartDataProcessor(safeTransactions);
};

// Outros hooks de preparação de dados para gráficos podem ser adicionados aqui
