
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { processMonthlyTotals } from './dataProcessor';
import { UseMonthlyTotalsResult } from './types';

/**
 * Hook para processar dados de transações para o gráfico de totais mensais
 */
export function useMonthlyTotalsData(
  transactions: any[],
  dateRange: DateRange | undefined | null,
  respectDateFilter: boolean = true,
  compareToPreviousPeriod: boolean = false
): UseMonthlyTotalsResult {
  const [result, setResult] = useState<UseMonthlyTotalsResult>({
    monthlyTotals: [],
    isLoading: true,
    error: null
  });
  
  useEffect(() => {
    try {
      // Verificar se há transações
      if (!transactions || transactions.length === 0) {
        setResult({
          monthlyTotals: [],
          isLoading: false,
          error: null
        });
        return;
      }
      
      // Processar os dados
      const processedData = processMonthlyTotals(
        transactions,
        dateRange,
        respectDateFilter,
        compareToPreviousPeriod
      );
      
      // Atualizar o estado com os dados processados
      setResult({
        monthlyTotals: processedData,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Erro ao processar dados mensais:", error);
      setResult({
        monthlyTotals: [],
        isLoading: false,
        error: error instanceof Error ? error : new Error('Erro desconhecido')
      });
    }
  }, [transactions, dateRange, respectDateFilter, compareToPreviousPeriod]);
  
  return result;
}
