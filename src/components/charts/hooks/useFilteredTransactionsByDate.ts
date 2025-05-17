
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

/**
 * Hook para filtrar transações por intervalo de datas
 */
export function useFilteredTransactionsByDate(
  transactions: Transaction[], 
  dateRange?: DateRange | null
) {
  return useMemo(() => {
    // Verificar se o dateRange existe e tem datas válidas
    if (!dateRange || !dateRange.from || isNaN(dateRange.from.getTime())) {
      return transactions;
    }
    
    // Validar também a data final do intervalo se existir
    if (dateRange.to && isNaN(dateRange.to.getTime())) {
      return transactions;
    }
    
    try {
      console.log(`Filtering chart data with date range: ${dateRange.from.toISOString()} to ${dateRange.to?.toISOString() || 'none'}`);
    } catch (error) {
      console.error('Error logging date range:', error);
    }
    
    return transactions.filter(transaction => {
      try {
        // Garantir que a string da data está em formato ISO
        const transactionDateStr = transaction.data;
        if (!transactionDateStr) return false;
        
        // Converter para o fuso horário de São Paulo
        try {
          const transactionDateUTC = parseISO(transactionDateStr);
          
          // Verificar se o parsing da data foi bem sucedido
          if (isNaN(transactionDateUTC.getTime())) {
            return false;
          }
          
          const transactionDate = toZonedTime(transactionDateUTC, TIMEZONE);
          
          // Normalizar para o início do dia
          const transactionDateStart = startOfDay(transactionDate);
          
          // Ajustar as datas do intervalo para o fuso horário de São Paulo
          const fromDate = dateRange.from ? startOfDay(toZonedTime(dateRange.from, TIMEZONE)) : null;
          const toDate = dateRange.to ? endOfDay(toZonedTime(dateRange.to, TIMEZONE)) : null;
          
          if (fromDate && toDate) {
            return isWithinInterval(transactionDateStart, { 
              start: fromDate, 
              end: toDate 
            });
          }
          
          if (fromDate) {
            return transactionDateStart >= fromDate;
          }
          
          return true;
        } catch (error) {
          console.error('Erro ao processar data para filtro:', transactionDateStr, error);
          return false;
        }
      } catch (error) {
        console.error('Erro ao analisar data para filtro de gráfico:', transaction.data, error);
        return false;
      }
    });
  }, [transactions, dateRange]);
}
