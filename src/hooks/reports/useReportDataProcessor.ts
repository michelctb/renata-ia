
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { 
  filterTransactionsByDateRange, 
  processMonthlyData, 
  processCategoryData,
  generateSimulatedMetasData
} from './reportDataUtils';
import { ReportData, MetaProgressItem } from './types';

/**
 * Hook para processar dados de transações para relatórios
 */
export function useReportDataProcessor(
  transactions: any[],
  dateRange: DateRange,
  isLoading: boolean
): ReportData {
  const [reportData, setReportData] = useState<ReportData>({
    transactions: [],
    monthlyData: [],
    categoryData: [],
    metasComProgresso: [],
    isLoading: true
  });

  // Processar dados quando as transações ou o intervalo de datas mudar
  useEffect(() => {
    if (isLoading) {
      setReportData(prev => ({ ...prev, isLoading: true }));
      return;
    }

    if (transactions.length === 0) {
      setReportData({
        transactions: [],
        monthlyData: [],
        categoryData: [],
        metasComProgresso: [],
        isLoading: false
      });
      return;
    }

    // Filtrar transações pelo intervalo de datas
    const filteredData = filterTransactionsByDateRange(transactions, dateRange);
    
    // Processar dados mensais
    const monthlyData = processMonthlyData(filteredData);
    
    // Processar dados por categoria
    const categoryData = processCategoryData(filteredData);
    
    // Dados simulados para metas (em um sistema real, buscaríamos do banco)
    // Garantindo que os dados correspondam ao formato MetaProgressItem
    const metas = generateSimulatedMetasData();
    const metasComProgresso: MetaProgressItem[] = metas.map(meta => ({
      categoria: meta.categoria,
      atual: meta.atual,
      meta: meta.meta,
      percentual: meta.percentual
    }));
    
    setReportData({
      transactions: filteredData,
      monthlyData,
      categoryData,
      metasComProgresso,
      isLoading: false
    });
  }, [transactions, dateRange, isLoading]);

  return reportData;
}
