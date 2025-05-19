
import { useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { Transaction } from '@/lib/supabase';

const TIMEZONE = 'America/Sao_Paulo';

// Interface para os dados mensais
export interface MonthlyTotalItem {
  month: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

/**
 * Normaliza o tipo de operação para padrão consistente
 * Trata variações como 'Saída', 'saída', 'Saida', 'saida', 'Entrada', 'entrada'
 */
export function normalizeOperationType(operation: string): 'entrada' | 'saída' {
  const normalized = operation.toLowerCase().trim();
  
  // Verificar variações de "entrada"
  if (normalized === 'entrada') {
    return 'entrada';
  }
  
  // Verificar variações de "saída"
  if (normalized.includes('sa') || normalized.includes('sá')) {
    return 'saída';
  }
  
  // Valor padrão se não for reconhecido
  console.warn(`Tipo de operação não reconhecido: ${operation}, considerando como saída`);
  return 'saída';
}

/**
 * Filtra transações pelo intervalo de datas
 */
function filterTransactionsByDateRange(
  transactions: Transaction[],
  dateRange: DateRange | null
): Transaction[] {
  if (!transactions.length || !dateRange?.from) return transactions;
  
  return transactions.filter(transaction => {
    try {
      // Converter para o fuso horário de São Paulo
      const transactionDateStr = transaction.data;
      const transactionDate = toZonedTime(parseISO(transactionDateStr), TIMEZONE);
      
      // Início e fim do intervalo
      const fromDate = dateRange.from ? toZonedTime(dateRange.from, TIMEZONE) : null;
      const toDate = dateRange.to ? toZonedTime(dateRange.to, TIMEZONE) : fromDate;
      
      if (fromDate && toDate) {
        return isWithinInterval(transactionDate, {
          start: fromDate,
          end: toDate
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao processar data para filtro:', transaction.data, error);
      return false;
    }
  });
}

/**
 * Processa os dados para o gráfico de totais mensais
 */
function processMonthlyTotals(transactions: Transaction[]): MonthlyTotalItem[] {
  const monthlyDataMap = new Map<string, MonthlyTotalItem>();
  
  transactions.forEach(transaction => {
    try {
      // Converter para o fuso horário de São Paulo
      const dateUTC = parseISO(transaction.data);
      const dateSaoPaulo = toZonedTime(dateUTC, TIMEZONE);
      
      // Formatar como "MMM/yyyy" (exemplo: "jan/2023")
      const monthYear = format(dateSaoPaulo, 'MMM/yyyy', { locale: ptBR });
      
      if (!monthlyDataMap.has(monthYear)) {
        monthlyDataMap.set(monthYear, { 
          month: monthYear, 
          entradas: 0, 
          saidas: 0,
          saldo: 0
        });
      }
      
      const monthData = monthlyDataMap.get(monthYear)!;
      const operationType = normalizeOperationType(transaction.operação);
      const value = Number(transaction.valor || 0);
      
      if (operationType === 'entrada') {
        monthData.entradas += value;
      } else {
        monthData.saidas += value;
      }
      
      // Calcular o saldo (entradas - saídas)
      monthData.saldo = monthData.entradas - monthData.saidas;
    } catch (error) {
      console.error('Erro ao processar dados mensais:', transaction, error);
    }
  });
  
  // Converter para array e ordenar cronologicamente
  return sortMonthlyData(Array.from(monthlyDataMap.values()));
}

/**
 * Ordena os dados mensais cronologicamente
 */
function sortMonthlyData(monthlyData: MonthlyTotalItem[]): MonthlyTotalItem[] {
  return monthlyData.sort((a, b) => {
    const monthA = a.month.split('/')[0];
    const yearA = a.month.split('/')[1];
    const monthB = b.month.split('/')[0];
    const yearB = b.month.split('/')[1];
    
    const monthNumberA = getMonthNumberFromName(monthA);
    const monthNumberB = getMonthNumberFromName(monthB);
    
    const dateA = new Date(`${yearA}-${monthNumberA}-01`);
    const dateB = new Date(`${yearB}-${monthNumberB}-01`);
    
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Obtém o número do mês a partir do nome abreviado
 */
function getMonthNumberFromName(monthName: string): string {
  const monthIndex = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ].findIndex(m => monthName.toLowerCase().startsWith(m)) + 1;
  
  return monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
}

/**
 * Hook para obter os dados de totais mensais
 */
export function useMonthlyTotalsData(
  transactions: Transaction[] = [],
  dateRange: DateRange | null
) {
  const monthlyTotals = useMemo(() => {
    if (!transactions?.length) return [];
    
    // Filtrar transações pelo intervalo de datas
    const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange);
    
    // Processar os dados para o gráfico
    return processMonthlyTotals(filteredTransactions);
  }, [transactions, dateRange]);
  
  return {
    monthlyTotals,
    isLoading: false,
    hasData: monthlyTotals.length > 0
  };
}
