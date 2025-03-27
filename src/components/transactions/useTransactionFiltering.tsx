
import { useState, useMemo } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { DateRange } from 'react-day-picker';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

/**
 * Custom hook for filtering transactions based on search term and date range
 * 
 * @param {Transaction[]} transactions - The list of transactions to filter
 * @param {DateRange | undefined} dateRange - The optional date range to filter by
 * @returns {Object} Object containing filtered transactions and filtering state
 */
export function useTransactionFiltering(
  transactions: Transaction[],
  dateRange?: DateRange | undefined
) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    // Filter by date range if provided
    if (dateRange?.from || dateRange?.to) {
      filtered = filtered.filter(transaction => {
        const transactionDateStr = transaction.data;
        
        try {
          // Parse a data da string para um objeto Date no fuso horário UTC
          const transactionDateUTC = parseISO(transactionDateStr);
          
          // Converte para o fuso horário desejado (America/Sao_Paulo)
          const transactionDateSaoPaulo = utcToZonedTime(transactionDateUTC, TIMEZONE);
          
          // Normaliza para o início do dia no fuso horário de São Paulo
          const transactionDate = startOfDay(transactionDateSaoPaulo);
          
          // Normalizar as datas do intervalo para garantir consistência no fuso horário de São Paulo
          const fromDate = dateRange.from ? startOfDay(utcToZonedTime(dateRange.from, TIMEZONE)) : null;
          const toDate = dateRange.to ? endOfDay(utcToZonedTime(dateRange.to, TIMEZONE)) : null;
          
          // Filter by start date if provided
          if (fromDate && transactionDate < fromDate) {
            return false;
          }
          
          // Filter by end date if provided
          if (toDate && transactionDate > toDate) {
            return false;
          }
          
          return true;
        } catch (error) {
          console.error('Erro ao processar data para filtragem:', transaction.data, error);
          return false;
        }
      });
    }
    
    // Filter by search term if provided
    if (searchTerm.trim()) {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      
      filtered = filtered.filter(transaction => {
        const description = transaction.descrição?.toLowerCase() || '';
        const category = transaction.categoria?.toLowerCase() || '';
        
        // Check if any field contains the search term
        return (
          description.includes(normalizedSearchTerm) ||
          category.includes(normalizedSearchTerm)
        );
      });
    }
    
    return filtered;
  }, [transactions, searchTerm, dateRange]);

  // Check if any filters are applied
  const hasFilters = searchTerm.trim().length > 0 || (dateRange?.from !== undefined || dateRange?.to !== undefined);

  // Calculate totals for income and expense transactions
  const { totalReceived, totalSpent } = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const operationType = transaction.operação?.toLowerCase();
        
        if (operationType === 'entrada') {
          acc.totalReceived += transaction.valor;
        } else if (operationType === 'saída') {
          acc.totalSpent += transaction.valor;
        }
        
        return acc;
      },
      { totalReceived: 0, totalSpent: 0 }
    );
  }, [filteredTransactions]);

  return {
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    hasFilters,
    totalReceived,
    totalSpent
  };
}
