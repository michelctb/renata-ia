
import { useMemo } from 'react';
import { format, parseISO, eachMonthOfInterval, min, max, isValid, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

/**
 * Hook/função para processar dados para o gráfico mensal
 * Esta implementação evita usar hooks dentro de hooks
 */
export function useMonthlyChartDataProcessor(transactions: any[] = []): Array<{name: string; entrada: number; saída: number}> {
  // Garantir que transactions seja sempre um array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  return useMemo(() => {
    try {
      // Primeiro, garantir que as transações são um array válido
      if (!Array.isArray(safeTransactions) || safeTransactions.length === 0) {
        console.log('useMonthlyChartDataProcessor - Array vazio ou inválido recebido');
        
        // Para casos sem transações, retornar pelo menos o mês atual com zeros
        const currentDate = new Date();
        const currentMonthStart = startOfMonth(currentDate);
        const currentMonthLabel = format(currentMonthStart, 'MMM yyyy', { locale: ptBR });
        
        return [{
          name: currentMonthLabel,
          entrada: 0,
          saída: 0
        }];
      }

      console.log('useMonthlyChartDataProcessor - Iniciando processamento de', safeTransactions.length, 'transações');
      
      // Inicializar valores para rastrear o intervalo de datas
      let validDates: Date[] = [];
      let successCount = 0;
      let errorCount = 0;
      
      // Primeiro passo: extrair todas as datas válidas das transações
      for (let index = 0; index < safeTransactions.length; index++) {
        try {
          const transaction = safeTransactions[index];
          
          // Verificar se a transação tem uma data válida
          if (!transaction || !transaction.data) {
            console.warn(`useMonthlyChartDataProcessor - Transação #${index} sem data válida`);
            continue;
          }
          
          // Parse the date string safely
          const dateStr = String(transaction.data || '');
          
          if (!dateStr || dateStr.trim() === '') {
            continue;
          }
          
          try {
            // Parse a data com tratamento de erro
            const dateUTC = parseISO(dateStr);
            
            // Verificar se a data foi parseada corretamente
            if (!isValid(dateUTC)) {
              console.warn(`useMonthlyChartDataProcessor - Data inválida na transação #${index}: ${dateStr}`);
              continue;
            }
            
            // Converter para o fuso horário correto
            const date = toZonedTime(dateUTC, TIMEZONE);
            validDates.push(date);
          } catch (dateError) {
            console.error(`useMonthlyChartDataProcessor - Erro processando data da transação #${index}: ${dateStr}`, dateError);
          }
        } catch (transactionError) {
          console.error(`useMonthlyChartDataProcessor - Erro processando transação #${index}:`, transactionError);
        }
      }
      
      // Se não temos datas válidas, retornar o mês atual com valores zerados
      if (validDates.length === 0) {
        console.log('useMonthlyChartDataProcessor - Nenhuma data válida encontrada nas transações');
        const currentDate = new Date();
        const currentMonthStart = startOfMonth(currentDate);
        const currentMonthLabel = format(currentMonthStart, 'MMM yyyy', { locale: ptBR });
        
        return [{
          name: currentMonthLabel,
          entrada: 0,
          saída: 0
        }];
      }
      
      // Encontrar a data mais antiga e mais recente com proteção contra arrays vazios
      const minDate = validDates.length ? min(validDates) : new Date();
      const maxDate = validDates.length ? max(validDates) : new Date();
      
      console.log(`useMonthlyChartDataProcessor - Intervalo de datas: ${minDate.toISOString()} a ${maxDate.toISOString()}`);
      
      // Garantir que estamos trabalhando com o primeiro dia do mês para minDate
      // e o último dia do mês para maxDate para ter meses completos
      const minMonthDate = startOfMonth(minDate);
      const maxMonthDate = endOfMonth(maxDate);
      
      // Verificar se as datas estão muito distantes (mais de 2 anos)
      // Se sim, limitar para o último ano para evitar gráficos muito grandes
      let startDateForRange = minMonthDate;
      const twoYearsInMonths = 24;
      const monthDiff = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + 
                        maxDate.getMonth() - minDate.getMonth();
                        
      if (monthDiff > twoYearsInMonths) {
        startDateForRange = startOfMonth(addMonths(maxMonthDate, -twoYearsInMonths));
        console.log(`useMonthlyChartDataProcessor - Intervalo limitado a 24 meses, novo início: ${startDateForRange.toISOString()}`);
      }
      
      // Gerar todos os meses entre a data mais antiga e mais recente
      // com proteção contra intervalos inválidos
      let allMonths: Date[] = [];
      try {
        allMonths = eachMonthOfInterval({
          start: startDateForRange,
          end: maxMonthDate
        });
      } catch (intervalError) {
        console.error('Erro ao gerar intervalo de meses:', intervalError);
        // Fallback para apenas o mês atual em caso de erro
        allMonths = [startOfMonth(new Date())];
      }
      
      console.log(`useMonthlyChartDataProcessor - Gerando ${allMonths.length} meses no intervalo`);
      
      // Inicializar o mapa com todos os meses no intervalo, com valores zerados
      const months = new Map<string, {name: string; entrada: number; saída: number}>();
      
      // Preencher o mapa com todos os meses do intervalo inicializados com zeros
      allMonths.forEach(monthDate => {
        const monthKey = format(monthDate, 'yyyy-MM');
        const monthLabel = format(monthDate, 'MMM yyyy', { locale: ptBR });
        months.set(monthKey, { name: monthLabel, entrada: 0, saída: 0 });
      });
      
      // Agora processar as transações para preencher os valores reais
      for (let index = 0; index < safeTransactions.length; index++) {
        try {
          const transaction = safeTransactions[index];
          
          // Verificar se a transação tem uma data válida
          if (!transaction || !transaction.data) {
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
              errorCount++;
              continue;
            }
            
            const dateUTC = parseISO(dateStr);
            
            // Verificar se a data foi parseada corretamente
            if (!isValid(dateUTC)) {
              console.warn(`useMonthlyChartDataProcessor - Data inválida na transação #${index}: ${dateStr}`);
              errorCount++;
              continue;
            }
            
            // Converter para o fuso horário correto com tratamento de erro
            const date = toZonedTime(dateUTC, TIMEZONE);
            
            // Extrair mês e ano formatados para exibição
            const monthKey = format(date, 'yyyy-MM');
            
            // Garantir que temos um valor válido para o tipo de operação
            let operationType = '';
            if (transaction.operação !== undefined) {
              operationType = String(transaction.operação).toLowerCase();
            }
            
            if (shouldLog) {
              console.log(`useMonthlyChartDataProcessor - Data processada para transação #${index}: ${monthKey}, operação: ${operationType}`);
            }
            
            // O mês já deve existir no mapa a partir da inicialização anterior
            const monthData = months.get(monthKey);
            
            if (!monthData) {
              console.warn(`useMonthlyChartDataProcessor - Mês não encontrado no mapa: ${monthKey}`);
              continue;
            }
            
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
      if (!months || months.size === 0) {
        return [{
          name: format(new Date(), 'MMM yyyy', { locale: ptBR }),
          entrada: 0,
          saída: 0
        }];
      }
      
      const result = Array.from(months.values())
        .sort((a, b) => {
          try {
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
          } catch (sortError) {
            console.error('Erro ao ordenar dados:', sortError);
            return 0;
          }
        });
      
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
