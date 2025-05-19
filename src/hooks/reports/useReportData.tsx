
import { DateRange } from 'react-day-picker';
import { useTransactionLoader } from './useTransactionLoader';
import { useReportDataProcessor } from './useReportDataProcessor';
import { ReportData } from './types';
import { useMonthlyTotalsData } from './monthly-totals';

// Ajuste de importações para incluir useMonthlyTotalsData
export { normalizeOperationType, getMonthNumberFromName } from './reportDataUtils';
export type { ReportData, MonthlyDataItem, CategoryDataItem, MetaProgressItem } from './types';

/**
 * Hook principal para obter dados de relatórios
 */
export function useReportData(selectedClient: string | null, dateRange: DateRange, compareToPreviousPeriod: boolean = false): ReportData {
  // Carregar transações
  const { transactions, isLoading: isLoadingTransactions } = useTransactionLoader(selectedClient);
  
  // Processar dados para o relatório
  const reportData = useReportDataProcessor(transactions, dateRange, isLoadingTransactions);
  
  // Carregar dados mensais com opção de comparação com período anterior
  const { monthlyTotals: comparisonData } = useMonthlyTotalsData(
    transactions, 
    dateRange, 
    true,
    compareToPreviousPeriod
  );
  
  // Adicionar dados de comparação ao resultado
  return {
    ...reportData,
    comparisonData: compareToPreviousPeriod ? comparisonData : []
  };
}
