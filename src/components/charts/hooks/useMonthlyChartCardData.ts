
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
    // Verificação de segurança logo no início
    if (!Array.isArray(safeTransactions)) {
      console.log("MonthlyChartCard - safeTransactions não é um array válido");
      return [];
    }
    
    if (safeTransactions.length === 0) {
      console.log("MonthlyChartCard - sem transações para processamento geral");
      return [];
    }
    
    try {
      // Usando o processador diretamente para evitar problemas com hooks em hooks
      return useMonthlyChartDataProcessor(safeTransactions);
    } catch (error) {
      console.error("Erro no processamento geral:", error);
      setHasError(true);
      setErrorMessage("Erro ao processar dados gerais");
      return [];
    }
  }, [safeTransactions]); // Garantimos que safeTransactions é sempre um array
  
  const filteredDataProcessed = useMemo(() => {
    // Verificação de segurança logo no início
    if (!Array.isArray(safeFilteredTransactions)) {
      console.log("MonthlyChartCard - safeFilteredTransactions não é um array válido");
      return [];
    }
    
    if (safeFilteredTransactions.length === 0) {
      console.log("MonthlyChartCard - sem transações para processamento filtrado");
      return [];
    }
    
    try {
      // Usando o processador diretamente
      return useMonthlyChartDataProcessor(safeFilteredTransactions);
    } catch (error) {
      console.error("Erro no processamento filtrado:", error);
      setHasError(true);
      setErrorMessage("Erro ao processar dados filtrados");
      return [];
    }
  }, [safeFilteredTransactions]); // Garantimos que safeFilteredTransactions é sempre um array
  
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
    // Verificar se temos dados diretos válidos
    if (Array.isArray(data) && data.length > 0) {
      console.log("MonthlyChartCard - usando dados diretos:", data);
      return data;
    } 
    
    try {
      // Verificações de segurança para allDataProcessed e filteredDataProcessed
      const safeAllData = Array.isArray(allDataProcessed) ? allDataProcessed : [];
      const safeFilteredData = Array.isArray(filteredDataProcessed) ? filteredDataProcessed : [];
      
      // Selecione entre dados completos ou filtrados, garantindo que sejam arrays
      const dataToUse = respectDateFilter ? safeFilteredData : safeAllData;
      
      console.log("MonthlyChartCard - usando dados processados:", dataToUse, 
        "modo:", respectDateFilter ? "filtrado" : "completo");
      return dataToUse;
    } catch (error) {
      console.error('Erro geral no MonthlyChartCard:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
      return [];
    }
  }, [data, respectDateFilter, allDataProcessed, filteredDataProcessed]);
  
  // Verificar se há dados disponíveis para o modo filtrado
  const hasFilteredData = Array.isArray(filteredDataProcessed) && filteredDataProcessed.length > 0;
  
  // Sempre retornar um array válido
  const safeChartData = Array.isArray(chartData) ? chartData : [];
  
  return {
    chartData: safeChartData,
    hasError,
    errorMessage,
    hasFilteredData,
    safeTransactions,
    safeFilteredTransactions
  };
}
