
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
  isInDateRange?: boolean; // Nova propriedade para indicar se está no filtro
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
 * Verifica se uma data está dentro do intervalo de datas
 */
function isDateInFilterRange(
  dateSaoPaulo: Date,
  dateRange: DateRange | null
): boolean {
  if (!dateRange?.from) return false;
  
  const fromDate = toZonedTime(dateRange.from, TIMEZONE);
  const toDate = dateRange.to ? toZonedTime(dateRange.to, TIMEZONE) : fromDate;
  
  return isWithinInterval(dateSaoPaulo, {
    start: fromDate,
    end: toDate
  });
}

/**
 * Processa os dados para o gráfico de totais mensais, sem filtrar por período
 * mas marcando quais meses estão dentro do filtro
 */
function processMonthlyTotals(
  transactions: Transaction[], 
  dateRange: DateRange | null,
  respectDateFilter: boolean
): MonthlyTotalItem[] {
  const monthlyDataMap = new Map<string, MonthlyTotalItem>();
  
  // Processar todas as transações para obter todos os meses com dados
  transactions.forEach(transaction => {
    try {
      // Converter para o fuso horário de São Paulo
      const dateUTC = parseISO(transaction.data);
      const dateSaoPaulo = toZonedTime(dateUTC, TIMEZONE);
      
      // Verificar se a data está dentro do filtro
      const isInFilter = isDateInFilterRange(dateSaoPaulo, dateRange);
      
      // Formatar como "MMM/yyyy" (exemplo: "jan/2023")
      const monthYear = format(dateSaoPaulo, 'MMM/yyyy', { locale: ptBR });
      
      if (!monthlyDataMap.has(monthYear)) {
        monthlyDataMap.set(monthYear, { 
          month: monthYear, 
          entradas: 0, 
          saidas: 0,
          saldo: 0,
          isInDateRange: isInFilter
        });
      }
      
      const monthData = monthlyDataMap.get(monthYear)!;
      
      // Se já marcado como dentro do filtro, manter essa marcação
      if (isInFilter) {
        monthData.isInDateRange = true;
      }
      
      // Apenas adicionar valores se:
      // 1. Não estamos respeitando o filtro de data (mostrar todos os meses) OU
      // 2. A data está dentro do filtro E estamos respeitando o filtro
      if (!respectDateFilter || (respectDateFilter && isInFilter)) {
        const operationType = normalizeOperationType(transaction.operação);
        const value = Number(transaction.valor || 0);
        
        if (operationType === 'entrada') {
          monthData.entradas += value;
        } else {
          monthData.saidas += value;
        }
        
        // Recalcular o saldo
        monthData.saldo = monthData.entradas - monthData.saidas;
      }
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
  dateRange: DateRange | null,
  respectDateFilter: boolean = false
) {
  const monthlyTotals = useMemo(() => {
    if (!transactions?.length) return [];
    
    // Processar os dados para o gráfico
    return processMonthlyTotals(transactions, dateRange, respectDateFilter);
  }, [transactions, dateRange, respectDateFilter]);
  
  return {
    monthlyTotals,
    isLoading: false,
    hasData: monthlyTotals.length > 0
  };
}
