
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { useMonthlyChartDataProcessor } from './monthlyChart';
import { useCategoryChartDataProcessor } from './useCategoryChartDataProcessor';

/**
 * Hook para preparar dados para gráfico mensal
 */
export const useMonthlyChartData = (transactions: Transaction[] = []) => {
  // Garantir que estamos lidando com arrays válidos
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  // Usar o processador diretamente para evitar problemas com hooks em hooks
  return useMonthlyChartDataProcessor(safeTransactions);
};

/**
 * Hook para preparar dados para gráfico de categoria
 */
export const useCategoryChartData = (
  transactions: Transaction[] = [], 
  transactionType: 'saída' | 'entrada' = 'saída'
) => {
  // Garantir que estamos lidando com arrays válidos
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  // Usar o processador de dados de categoria
  return useCategoryChartDataProcessor(safeTransactions, transactionType);
};

// Outros hooks de preparação de dados para gráficos podem ser adicionados aqui
