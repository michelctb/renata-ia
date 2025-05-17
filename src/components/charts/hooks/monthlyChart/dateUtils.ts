
import { format, parseISO, eachMonthOfInterval, min, max, isValid, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { DateProcessingOptions } from './types';

// Constante para o fuso horário padrão
export const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

/**
 * Extrai datas válidas das transações
 */
export function extractValidDates(transactions: any[] = [], timezone: string = DEFAULT_TIMEZONE): Date[] {
  const validDates: Date[] = [];
  
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return validDates;
  }
  
  for (let index = 0; index < transactions.length; index++) {
    try {
      const transaction = transactions[index];
      
      if (!transaction || !transaction.data) {
        continue;
      }
      
      const dateStr = String(transaction.data || '');
      
      if (!dateStr || dateStr.trim() === '') {
        continue;
      }
      
      const dateUTC = parseISO(dateStr);
      
      if (!isValid(dateUTC)) {
        console.warn(`Data inválida na transação #${index}: ${dateStr}`);
        continue;
      }
      
      const date = toZonedTime(dateUTC, timezone);
      validDates.push(date);
    } catch (error) {
      console.error(`Erro processando data da transação #${index}:`, error);
    }
  }
  
  return validDates;
}

/**
 * Gera intervalo de meses entre as datas mais antigas e mais recentes
 */
export function generateMonthsInterval(
  validDates: Date[],
  options: DateProcessingOptions = {}
): Date[] {
  const { timezone = DEFAULT_TIMEZONE, limitMonths = 24 } = options;
  
  if (validDates.length === 0) {
    return [startOfMonth(new Date())];
  }
  
  try {
    // Encontrar a data mais antiga e mais recente
    const minDate = min(validDates);
    const maxDate = max(validDates);
    
    // Garantir meses completos
    const minMonthDate = startOfMonth(minDate);
    const maxMonthDate = endOfMonth(maxDate);
    
    // Verificar se o intervalo é muito grande
    let startDateForRange = minMonthDate;
    const monthDiff = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + 
                      maxDate.getMonth() - minDate.getMonth();
    
    if (monthDiff > limitMonths) {
      startDateForRange = startOfMonth(addMonths(maxMonthDate, -limitMonths));
      console.log(`Intervalo limitado a ${limitMonths} meses, novo início: ${startDateForRange.toISOString()}`);
    }
    
    // Gerar todos os meses no intervalo
    return eachMonthOfInterval({
      start: startDateForRange,
      end: maxMonthDate
    });
  } catch (error) {
    console.error('Erro ao gerar intervalo de meses:', error);
    return [startOfMonth(new Date())];
  }
}

/**
 * Formata um mês para exibição
 */
export function formatMonthForDisplay(date: Date): string {
  return format(date, 'MMM yyyy', { locale: ptBR });
}

/**
 * Gera uma chave única para um mês
 */
export function generateMonthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}

/**
 * Cria um mapa de meses inicializados com valores zerados
 */
export function initializeMonthsMap(months: Date[]): Map<string, { name: string; entrada: number; saída: number }> {
  const monthsMap = new Map<string, { name: string; entrada: number; saída: number }>();
  
  months.forEach(monthDate => {
    const monthKey = generateMonthKey(monthDate);
    const monthLabel = formatMonthForDisplay(monthDate);
    monthsMap.set(monthKey, { name: monthLabel, entrada: 0, saída: 0 });
  });
  
  return monthsMap;
}
