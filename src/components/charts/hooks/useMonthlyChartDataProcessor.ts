
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

/**
 * Hook/função para processar dados para o gráfico mensal
 * Esta implementação evita usar hooks dentro de hooks
 */
export function useMonthlyChartDataProcessor(transactions: any[] = []): Array<{name: string; entrada: number; saída: number}> {
  return useMemo(() => {
    try {
      // Primeiro, garantir que as transações são um array válido
      if (!Array.isArray(transactions) || transactions.length === 0) {
        console.log('useMonthlyChartDataProcessor - Array vazio ou inválido recebido');
        return [];
      }

      console.log('useMonthlyChartDataProcessor - Iniciando processamento de', transactions.length, 'transações');
      
      const months = new Map<string, {name: string; entrada: number; saída: number}>();
      
      let successCount = 0;
      let errorCount = 0;
      
      // Iterar sobre as transações com verificações de segurança
      for (let index = 0; index < transactions.length; index++) {
        try {
          const transaction = transactions[index];
          
          // Verificar se a transação tem uma data válida
          if (!transaction || !transaction.data) {
            console.warn(`useMonthlyChartDataProcessor - Transação #${index} sem data válida`);
            errorCount++;
            continue;
          }
          
          // Parse the date string safely
          const dateStr = String(transaction.data || '');
          
          const shouldLog = index < 5 || index % 20 === 0;
          if (shouldLog) {
            console.log(`useMonthlyChartDataProcessor - Processando transação #${index}, data: ${dateStr}`);
          }
          
          try {
            // Parse a data com tratamento de erro
            if (!dateStr || dateStr.trim() === '') {
              console.warn(`useMonthlyChartDataProcessor - Data vazia na transação #${index}`);
              errorCount++;
              continue;
            }
            
            const dateUTC = parseISO(dateStr);
            
            // Verificar se a data foi parseada corretamente
            if (isNaN(dateUTC.getTime())) {
              console.warn(`useMonthlyChartDataProcessor - Data inválida na transação #${index}: ${dateStr}`);
              errorCount++;
              continue;
            }
            
            // Converter para o fuso horário correto com tratamento de erro
            const date = toZonedTime(dateUTC, TIMEZONE);
            
            // Extrair mês e ano formatados para exibição
            const monthKey = format(date, 'yyyy-MM');
            const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
            
            // Garantir que temos um valor válido para o tipo de operação
            let operationType = '';
            if (transaction.operação !== undefined) {
              operationType = String(transaction.operação).toLowerCase();
            }
            
            if (shouldLog) {
              console.log(`useMonthlyChartDataProcessor - Data processada para transação #${index}: ${monthKey} (${monthLabel}), operação: ${operationType}`);
            }
            
            // Inicializar o contador do mês se não existir
            if (!months.has(monthKey)) {
              months.set(monthKey, { 
                name: monthLabel, 
                entrada: 0, 
                saída: 0 
              });
            }
            
            const monthData = months.get(monthKey)!;
            
            // Converter valor para número com validação
            let valor = 0;
            if (transaction.valor !== undefined) {
              const parsedValor = Number(transaction.valor);
              valor = isNaN(parsedValor) ? 0 : parsedValor;
            }
            
            // Contabilizar o valor na categoria correta
            if (operationType === 'entrada') {
              monthData.entrada += valor;
            } else if (operationType === 'saída' || operationType === 'saida') {
              monthData.saída += valor;
            }
            
            successCount++;
          } catch (dateError) {
            console.error(`useMonthlyChartDataProcessor - Erro processando data da transação #${index}: ${dateStr}`, dateError);
            errorCount++;
          }
        } catch (transactionError) {
          console.error(`useMonthlyChartDataProcessor - Erro processando transação #${index}:`, transactionError);
          errorCount++;
        }
      }
      
      console.log(`useMonthlyChartDataProcessor - Resultados: ${successCount} processadas com sucesso, ${errorCount} com erro`);
      
      // Converter os dados para array e ordenar por mês
      if (months.size === 0) {
        return [];
      }
      
      const result = Array.from(months.values())
        .sort((a, b) => {
          // Função para extrair mês e ano do nome do mês
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
      
      console.log('useMonthlyChartDataProcessor - Dados finais:', result);
      return result;
    } catch (error) {
      console.error("Erro ao processar dados mensais:", error);
      return []; // Garante que mesmo em caso de erro, retornamos um array vazio
    }
  }, [transactions]);
}
