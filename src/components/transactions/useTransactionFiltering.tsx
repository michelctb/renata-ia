
import { useMemo, useState } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO, isValid } from 'date-fns';

export function useTransactionFiltering(
  transactions: Transaction[], 
  dateRange?: DateRange | undefined,
  selectedCategory?: string | null
) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Set a default search term if a category is selected
  useMemo(() => {
    if (selectedCategory) {
      setSearchTerm(selectedCategory);
    }
  }, [selectedCategory]);
  
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    return transactions.filter(transaction => {
      let matches = true;
      
      // Filter by search term if provided
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          (transaction.categoria && transaction.categoria.toLowerCase().includes(searchLower)) ||
          (transaction.descricao && transaction.descricao.toLowerCase().includes(searchLower)) ||
          String(transaction.valor).includes(searchLower);
          
        if (!matchesSearch) matches = false;
      }
      
      // Filter by date range if provided
      if (dateRange?.from && transaction.data) {
        try {
          const transactionDate = parseISO(transaction.data);
          
          if (isValid(transactionDate)) {
            const withinRange = dateRange.to 
              ? isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to })
              : transactionDate >= dateRange.from;
              
            if (!withinRange) matches = false;
          }
        } catch (error) {
          console.error('Invalid date format:', transaction.data);
          matches = false;
        }
      }
      
      return matches;
    });
  }, [transactions, searchTerm, dateRange]);
  
  // Calculate totals
  const [totalReceived, totalSpent] = useMemo(() => {
    if (!filteredTransactions.length) return [0, 0];
    
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.operação === 'entrada') {
          acc[0] += transaction.valor || 0;
        } else if (transaction.operação === 'saída') {
          acc[1] += transaction.valor || 0;
        }
        return acc;
      },
      [0, 0]
    );
  }, [filteredTransactions]);
  
  const hasFilters = !!searchTerm || (!!dateRange?.from || !!dateRange?.to);
  
  return {
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    hasFilters,
    totalReceived,
    totalSpent
  };
}
