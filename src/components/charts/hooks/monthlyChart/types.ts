
/**
 * Tipos utilizados pelo processador de dados do gráfico mensal
 */

export interface MonthlyChartDataPoint {
  name: string;
  entrada: number;
  saída: number;
}

export interface DateProcessingOptions {
  timezone?: string;
  limitMonths?: number;
}

/**
 * Interface para os dados e props do MonthlyChartCard
 */
export interface MonthlyChartCardDataProps {
  data?: MonthlyChartDataPoint[];
  transactions?: any[];
  filteredTransactions?: any[];
  respectDateFilter?: boolean;
}

/**
 * Interface para o retorno do hook useMonthlyChartCardData
 */
export interface MonthlyChartCardDataResult {
  chartData: MonthlyChartDataPoint[];
  hasError: boolean;
  errorMessage: string;
  hasFilteredData: boolean;
  safeTransactions: any[];
  safeFilteredTransactions: any[];
}
