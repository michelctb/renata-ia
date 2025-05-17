
import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MonthlyChartDataPoint } from './types';
import { DEFAULT_TIMEZONE, extractValidDates, generateMonthsInterval, initializeMonthsMap } from './dateUtils';
import { processAllTransactions } from './transactionProcessor';
import { sortMonthlyData, generateDefaultDataPoint } from './sortingUtils';

/**
 * Hook/função para processar dados para o gráfico mensal
 * Versão refatorada que utiliza funções auxiliares
 */
export function useMonthlyChartDataProcessor(transactions: any[] = []): Array<MonthlyChartDataPoint> {
  // Garantir que transactions seja sempre um array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  return useMemo(() => {
    try {
      console.log('useMonthlyChartDataProcessor - Iniciando processamento de', safeTransactions.length, 'transações');
      
      // Se não há transações, retornar ponto de dados padrão
      if (!Array.isArray(safeTransactions) || safeTransactions.length === 0) {
        console.log('useMonthlyChartDataProcessor - Array vazio ou inválido recebido');
        return [generateDefaultDataPoint()];
      }

      // Extrair datas válidas das transações
      const validDates = extractValidDates(safeTransactions, DEFAULT_TIMEZONE);
      
      // Se não temos datas válidas, retornar ponto de dados padrão
      if (validDates.length === 0) {
        console.log('useMonthlyChartDataProcessor - Nenhuma data válida encontrada nas transações');
        return [generateDefaultDataPoint()];
      }
      
      // Gerar intervalo de meses entre as datas mais antigas e mais recentes
      const allMonths = generateMonthsInterval(validDates, { timezone: DEFAULT_TIMEZONE });
      console.log(`useMonthlyChartDataProcessor - Gerando ${allMonths.length} meses no intervalo`);
      
      // Inicializar mapa com todos os meses no intervalo com valores zerados
      const months = initializeMonthsMap(allMonths);
      
      // Processar todas as transações e atualizar o mapa de meses
      const { successCount, errorCount } = processAllTransactions(safeTransactions, months, DEFAULT_TIMEZONE);
      console.log(`useMonthlyChartDataProcessor - Resultados: ${successCount} processadas com sucesso, ${errorCount} com erro`);
      
      // Converter mapa em array e ordenar
      if (!months || months.size === 0) {
        return [generateDefaultDataPoint()];
      }
      
      const result = sortMonthlyData(Array.from(months.values()));
      
      console.log('useMonthlyChartDataProcessor - Dados finais:', result);
      return result;
    } catch (error) {
      console.error("Erro ao processar dados mensais:", error);
      // Em caso de erro, retornar pelo menos um mês com valores zerados
      return [{
        name: format(new Date(), 'MMM yyyy', { locale: ptBR }),
        entrada: 0,
        saída: 0
      }];
    }
  }, [safeTransactions]); // Usando safeTransactions que é garantido como array
}
