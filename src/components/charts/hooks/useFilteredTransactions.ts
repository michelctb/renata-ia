
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

export function useFilteredTransactions(
  transactions: Transaction[], 
  dateRange?: DateRange | null
) {
  return useMemo(() => {
    // Log para debug
    console.log('useFilteredTransactions - transactions:', transactions.length);
    console.log('useFilteredTransactions - dateRange:', dateRange);
    
    // Verificar se o dateRange e sua propriedade from são válidos
    if (!dateRange?.from || isNaN(dateRange.from.getTime())) {
      console.log('useFilteredTransactions - dateRange inválido ou sem from, retornando todas as transactions');
      return transactions;
    }
    
    // Se tiver to, verifica se é válido
    if (dateRange.to && isNaN(dateRange.to.getTime())) {
      console.log('useFilteredTransactions - dateRange com to inválido, usando apenas from');
      return transactions.filter(transaction => {
        try {
          const transactionDateStr = transaction.data;
          const transactionDateUTC = parseISO(transactionDateStr);
          const transactionDateSaoPaulo = toZonedTime(transactionDateUTC, TIMEZONE);
          const transactionDate = startOfDay(transactionDateSaoPaulo);
          
          const fromDate = startOfDay(toZonedTime(dateRange.from!, TIMEZONE));
          return transactionDate >= fromDate;
        } catch (error) {
          console.error('Error parsing date for transaction:', transaction.data, error);
          return false;
        }
      });
    }
    
    const fromDate = dateRange.from ? startOfDay(toZonedTime(dateRange.from, TIMEZONE)) : null;
    const toDate = dateRange.to ? endOfDay(toZonedTime(dateRange.to, TIMEZONE)) : null;
    
    try {
      console.log(`Filtering transactions with date range: ${fromDate?.toISOString()} to ${toDate?.toISOString() || 'none'}`);
    } catch (error) {
      console.error('Error logging date range:', error);
    }
    
    return transactions.filter(transaction => {
      try {
        // Garantir que a string da data está em formato ISO
        const transactionDateStr = transaction.data;
        
        // Converter para o fuso horário de São Paulo
        const transactionDateUTC = parseISO(transactionDateStr);
        const transactionDateSaoPaulo = toZonedTime(transactionDateUTC, TIMEZONE);
        
        // Normalizar para o início do dia
        const transactionDate = startOfDay(transactionDateSaoPaulo);
        
        if (fromDate && toDate) {
          return isWithinInterval(transactionDate, { 
            start: fromDate, 
            end: toDate 
          });
        }
        
        if (fromDate) {
          return transactionDate >= fromDate;
        }
        
        return true;
      } catch (error) {
        console.error('Error parsing date for transaction:', transaction.data, error);
        return false;
      }
    });
  }, [transactions, dateRange]);
}
