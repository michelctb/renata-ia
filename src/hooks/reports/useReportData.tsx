
import { DateRange } from 'react-day-picker';
import { useTransactionLoader } from './useTransactionLoader';
import { useReportDataProcessor } from './useReportDataProcessor';
import { ReportData } from './types';

export { normalizeOperationType, getMonthNumberFromName } from './reportDataUtils';
export type { ReportData, MonthlyDataItem, CategoryDataItem, MetaProgressItem } from './types';

/**
 * Hook principal para obter dados de relatórios
 */
export function useReportData(selectedClient: string | null, dateRange: DateRange): ReportData {
  // Carregar transações
  const { transactions, isLoading: isLoadingTransactions } = useTransactionLoader(selectedClient);
  
  // Processar dados para o relatório
  const reportData = useReportDataProcessor(transactions, dateRange, isLoadingTransactions);
  
  return reportData;
}
