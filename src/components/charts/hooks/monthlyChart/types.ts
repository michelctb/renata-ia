
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
