
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

/**
 * Hook para processar dados para o gráfico mensal
 */
export function useMonthlyChartDataProcessor(transactions: any[] = []): Array<{name: string; entrada: number; saída: number}> {
  return useMemo(() => {
    // Primeiro, garantimos que as transações são um array válido
    if (!Array.isArray(transactions) || transactions.length === 0) {
      console.log('useMonthlyChartData - Array vazio ou inválido recebido');
      return [];
    }

    try {
      console.log('useMonthlyChartData - Iniciando processamento de', transactions.length, 'transações');
      
      const months = new Map();
      
      let successCount = 0;
      let errorCount = 0;
      
      transactions.forEach((transaction, index) => {
        try {
          if (!transaction.data) {
            console.warn(`useMonthlyChartData - Transação #${index} sem data:`, transaction);
            errorCount++;
            return;
          }
          
          // Parse the date and convert to São Paulo timezone
          const dateStr = transaction.data;
          
          // Log detalhado apenas para algumas transações para não sobrecarregar o console
          const shouldLog = index < 5 || index % 20 === 0;
          if (shouldLog) {
            console.log(`useMonthlyChartData - Processando transação #${index}, data: ${dateStr}`);
          }
          
          try {
            const dateUTC = parseISO(dateStr);
            
            // Verificar se a data foi parseada corretamente
            if (isNaN(dateUTC.getTime())) {
              console.warn(`useMonthlyChartData - Data inválida na transação #${index}:`, dateStr);
              errorCount++;
              return;
            }
            
            // Usar toZonedTime com tratamento de erro
            const date = toZonedTime(dateUTC, TIMEZONE);
            
            const monthKey = format(date, 'yyyy-MM');
            const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
            const operationType = transaction.operação?.toLowerCase() || '';
            
            if (shouldLog) {
              console.log(`useMonthlyChartData - Data processada para transação #${index}: ${monthKey} (${monthLabel}), operação: ${operationType}`);
            }
            
            if (!months.has(monthKey)) {
              months.set(monthKey, { 
                name: monthLabel, 
                entrada: 0, 
                saída: 0 
              });
            }
            
            const monthData = months.get(monthKey);
            const valor = Number(transaction.valor || 0);
            
            if (isNaN(valor)) {
              console.warn(`useMonthlyChartData - Valor inválido na transação #${index}:`, transaction.valor);
              errorCount++;
              return;
            }
            
            if (operationType === 'entrada') {
              monthData.entrada += valor;
            } else if (operationType === 'saída' || operationType === 'saida') {
              monthData.saída += valor;
            }
            
            successCount++;
          } catch (dateError) {
            console.error(`useMonthlyChartData - Erro processando data da transação #${index}:`, dateStr, dateError);
            errorCount++;
            return;
          }
        } catch (error) {
          console.error(`useMonthlyChartData - Erro geral processando transação #${index}:`, error);
          errorCount++;
        }
      });
      
      console.log(`useMonthlyChartData - Resultados: ${successCount} processadas com sucesso, ${errorCount} com erro`);
      
      const result = Array.from(months.values())
        .sort((a, b) => {
          // Corrigir o erro de tipo Month ordenando corretamente os meses
          const getMonthYear = (monthName: string) => {
            const parts = monthName.split(' ');
            if (parts.length !== 2) return { month: 0, year: 0 };
            
            const monthMap: Record<string, number> = {
              'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6,
              'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12
            };
            
            const monthIdx = monthMap[parts[0].toLowerCase()] || 0;
            const year = parseInt(parts[1]) || 0;
            
            return { month: monthIdx, year };
          };
          
          const dateA = getMonthYear(a.name);
          const dateB = getMonthYear(b.name);
          
          if (dateA.year !== dateB.year) {
            return dateA.year - dateB.year;
          }
          
          return dateA.month - dateB.month;
        });
      
      console.log('useMonthlyChartData - Dados finais:', result);
      return result;
    } catch (error) {
      console.error("Erro ao processar dados mensais:", error);
      return []; // Garante que mesmo em caso de erro, retornamos um array vazio
    }
  }, [transactions]);
}
