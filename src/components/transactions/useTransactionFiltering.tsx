
import { useState, useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { parseISO } from 'date-fns';

/**
 * Custom hook for filtering and sorting transactions.
 * Provides functionality to filter transactions by date range and search term.
 * 
 * @param {Transaction[]} transactions - The list of transactions to filter
 * @param {DateRange | null} dateRange - The selected date range for filtering
 * @returns {Object} An object containing filtered transactions and search state
 * @property {string} searchTerm - Current search term
 * @property {Function} setSearchTerm - Function to update the search term
 * @property {Transaction[]} filteredTransactions - The filtered and sorted transactions
 * @property {boolean} hasFilters - Whether any filters are currently applied
 */
export function useTransactionFiltering(transactions: Transaction[], dateRange: DateRange | null) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    // Filter by date range and search term
    const filtered = transactions.filter(transaction => {
      // Filter by date
      let matchesDateRange = true;
      if (dateRange && dateRange.from) {
        const transactionDate = parseISO(transaction.data);
        
        if (dateRange.to) {
          // Check if within range (inclusive)
          matchesDateRange = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
          
          // Debug for 01/03 transactions
          if (transaction.data.includes('2025-03-01')) {
            console.log('TransactionTable - Transação 01/03:', 
              transaction.data,
              'Intervalo:', dateRange.from.toISOString(), 'até', dateRange.to.toISOString(),
              'Incluída?', matchesDateRange
            );
          }
        } else {
          matchesDateRange = transactionDate >= dateRange.from;
        }
      }
        
      // Filter by search term
      const matchesSearch = searchTerm 
        ? transaction.descrição.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.categoria.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
        
      return matchesDateRange && matchesSearch;
    });
    
    // Sort by date (newest first)
    return [...filtered].sort((a, b) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });
  }, [transactions, dateRange, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    hasFilters: !!searchTerm || !!(dateRange?.from)
  };
}
