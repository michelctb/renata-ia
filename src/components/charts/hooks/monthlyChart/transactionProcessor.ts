
import { parseISO, isValid, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { MonthlyChartDataPoint } from './types';
import { DEFAULT_TIMEZONE, generateMonthKey } from './dateUtils';

const ENABLE_DEBUG = false;

/**
 * Processa uma transação individual e atualiza o mapa de meses
 */
export function processTransaction(
  transaction: any,
  index: number,
  months: Map<string, MonthlyChartDataPoint>,
  timezone: string = DEFAULT_TIMEZONE
): void {
  try {
    if (!transaction || !transaction.data) {
      return;
    }
    
    const dateStr = String(transaction.data || '');
    const shouldLog = index < 5 || index % 20 === 0;
    
    if (ENABLE_DEBUG && shouldLog) {
      console.log(`Processando transação #${index}, data: ${dateStr}`);
    }
    
    if (!dateStr || dateStr.trim() === '') {
      return;
    }
    
    const dateUTC = parseISO(dateStr);
    
    if (!isValid(dateUTC)) {
      console.warn(`Data inválida na transação #${index}: ${dateStr}`);
      return;
    }
    
    const date = toZonedTime(dateUTC, timezone);
    const monthKey = generateMonthKey(date);
    
    let operationType = '';
    if (transaction.operação !== undefined) {
      operationType = String(transaction.operação).toLowerCase();
    }
    
    if (ENABLE_DEBUG && shouldLog) {
      console.log(`Data processada para transação #${index}: ${monthKey}, operação: ${operationType}`);
    }
    
    const monthData = months.get(monthKey);
    
    if (!monthData) {
      console.warn(`Mês não encontrado no mapa: ${monthKey}`);
      return;
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
  } catch (error) {
    console.error(`Erro processando transação #${index}:`, error);
  }
}

/**
 * Processa todas as transações para popular o mapa de meses
 */
export function processAllTransactions(
  transactions: any[],
  months: Map<string, MonthlyChartDataPoint>,
  timezone: string = DEFAULT_TIMEZONE
): { successCount: number; errorCount: number } {
  let successCount = 0;
  let errorCount = 0;
  
  if (!Array.isArray(transactions)) {
    console.warn('Array de transações inválido recebido');
    return { successCount, errorCount };
  }
  
  for (let index = 0; index < transactions.length; index++) {
    try {
      processTransaction(transactions[index], index, months, timezone);
      successCount++;
    } catch (error) {
      console.error(`Erro processando transação #${index}:`, error);
      errorCount++;
    }
  }
  
  return { successCount, errorCount };
}
