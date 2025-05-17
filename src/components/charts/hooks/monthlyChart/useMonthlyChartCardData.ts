
import { useState, useMemo, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useMonthlyChartDataProcessor } from './useMonthlyChartDataProcessor';
import { MonthlyChartDataPoint, MonthlyChartCardDataProps, MonthlyChartCardDataResult } from './types';

/**
 * Hook refatorado para processar dados do cartão de gráfico mensal
 * Segue o padrão de organização do monthlyChart
 */
export function useMonthlyChartCardData({
  data,
  transactions = [],
  filteredTransactions = [],
  respectDateFilter = false
}: MonthlyChartCardDataProps): MonthlyChartCardDataResult {
  // Estados para gerenciamento de erro
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Garantir que as transações são arrays válidos
  const safeTransactions = useMemo(() => {
    return Array.isArray(transactions) ? transactions : [];
  }, [transactions]);
  
  const safeFilteredTransactions = useMemo(() => {
    return Array.isArray(filteredTransactions) ? filteredTransactions : [];
  }, [filteredTransactions]);
  
  // Processar dados completos
  const allDataProcessed = useMemo(() => {
    try {
      if (safeTransactions.length === 0) {
        console.log("MonthlyChartCard - sem transações para processamento geral");
        return [];
      }
      
      const result = useMonthlyChartDataProcessor(safeTransactions);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Erro no processamento geral:", error);
      setHasError(true);
      setErrorMessage("Erro ao processar dados gerais");
      return [];
    }
  }, [safeTransactions]);
  
  // Processar dados filtrados
  const filteredDataProcessed = useMemo(() => {
    try {
      if (safeFilteredTransactions.length === 0) {
        console.log("MonthlyChartCard - sem transações para processamento filtrado");
        return [];
      }
      
      const result = useMonthlyChartDataProcessor(safeFilteredTransactions);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Erro no processamento filtrado:", error);
      setHasError(true);
      setErrorMessage("Erro ao processar dados filtrados");
      return [];
    }
  }, [safeFilteredTransactions]);
  
  // Efeito para mostrar toast apenas uma vez em caso de erro
  useEffect(() => {
    if (hasError) {
      toast({
        title: "Erro no gráfico mensal",
        description: errorMessage || "Não foi possível processar os dados para o gráfico",
        variant: "destructive"
      });
    }
  }, [hasError, errorMessage]);
  
  // Selecionar quais dados usar com lógica simplificada
  const chartData = useMemo(() => {
    try {
      // Verificar se temos dados diretos válidos primeiro
      if (Array.isArray(data) && data.length > 0) {
        return data;
      } 
      
      // Selecione entre dados completos ou filtrados
      const dataToUse = respectDateFilter ? filteredDataProcessed : allDataProcessed;
      return Array.isArray(dataToUse) ? dataToUse : [];
    } catch (error) {
      console.error('Erro geral no MonthlyChartCard:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
      return [];
    }
  }, [data, respectDateFilter, allDataProcessed, filteredDataProcessed]);
  
  // Verificar se há dados disponíveis para o modo filtrado
  const hasFilteredData = useMemo(() => {
    return Array.isArray(filteredDataProcessed) && filteredDataProcessed.length > 0;
  }, [filteredDataProcessed]);
  
  return {
    chartData,
    hasError,
    errorMessage,
    hasFilteredData,
    safeTransactions,
    safeFilteredTransactions
  };
}
