
import { useState, useMemo, useEffect } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { useMonthlyChartDataProcessor } from './useMonthlyChartDataProcessor';
import { toast } from '@/hooks/use-toast';

interface UseMonthlyChartCardDataProps {
  data?: Array<{ name: string; entrada: number; saída: number; }>;
  transactions?: Transaction[];
  filteredTransactions?: Transaction[];
  respectDateFilter?: boolean;
}

export function useMonthlyChartCardData({
  data,
  transactions = [],
  filteredTransactions = [],
  respectDateFilter = false
}: UseMonthlyChartCardDataProps) {
  // Estados para gerenciamento de erro
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Garantir que as transações são arrays válidos
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeFilteredTransactions = Array.isArray(filteredTransactions) ? filteredTransactions : [];
  
  // Processar dados com useMonthlyChartDataProcessor - com proteção contra undefined
  const allDataProcessed = useMemo(() => {
    try {
      if (safeTransactions.length === 0) {
        console.log("MonthlyChartCard - sem transações para processamento geral");
        return [];
      }
      
      // Usando o processador diretamente para evitar problemas com hooks em hooks
      return useMonthlyChartDataProcessor(safeTransactions);
    } catch (error) {
      console.error("Erro no processamento geral:", error);
      setHasError(true);
      setErrorMessage("Erro ao processar dados gerais");
      return [];
    }
  }, [safeTransactions]);
  
  const filteredDataProcessed = useMemo(() => {
    try {
      if (safeFilteredTransactions.length === 0) {
        console.log("MonthlyChartCard - sem transações para processamento filtrado");
        return [];
      }
      
      // Usando o processador diretamente
      return useMonthlyChartDataProcessor(safeFilteredTransactions);
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
  
  // Selecionar quais dados usar - com proteção contra undefined
  const chartData = useMemo(() => {
    try {
      // Se dados diretos forem fornecidos, use-os (com verificação de segurança)
      if (Array.isArray(data) && data.length > 0) {
        console.log("MonthlyChartCard - usando dados diretos:", data);
        return data;
      } else {
        // Se não, selecione entre dados completos ou filtrados, garantindo que sejam arrays
        const dataToUse = respectDateFilter ? 
          (Array.isArray(filteredDataProcessed) ? filteredDataProcessed : []) : 
          (Array.isArray(allDataProcessed) ? allDataProcessed : []);
          
        console.log("MonthlyChartCard - usando dados processados:", dataToUse, 
          "modo:", respectDateFilter ? "filtrado" : "completo");
        return dataToUse;
      }
    } catch (error) {
      console.error('Erro geral no MonthlyChartCard:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
      return [];
    }
  }, [data, respectDateFilter, allDataProcessed, filteredDataProcessed]);
  
  // Verificar se há dados disponíveis para o modo filtrado
  const hasFilteredData = Array.isArray(filteredDataProcessed) && filteredDataProcessed.length > 0;
  
  return {
    chartData,
    hasError,
    errorMessage,
    hasFilteredData,
    safeTransactions,
    safeFilteredTransactions
  };
}
