
import { useState, useMemo } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/lib/supabase';

/**
 * Hook to manage transaction filtering and search functionality
 */
export function useTransactionFiltering(
  transactions: Transaction[],
  dateRange: DateRange | null
) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter transactions by date range and search term
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Apply date filter if date range exists
      const withinDateRange = dateRange
        ? (() => {
            const transactionDate = parseISO(transaction.data);
            return isWithinInterval(transactionDate, {
              start: dateRange.from,
              end: dateRange.to || dateRange.from
            });
          })()
        : true;

      // Apply search filter if search term exists
      const matchesSearch = searchTerm
        ? (
            transaction.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.valor?.toString().includes(searchTerm) ||
            transaction.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      return withinDateRange && matchesSearch;
    });
  }, [transactions, dateRange, searchTerm]);

  // Calculate totals
  const totalIncome = useMemo(() => 
    filteredTransactions
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + (parseFloat(t.valor.toString()) || 0), 0),
    [filteredTransactions]
  );

  const totalExpenses = useMemo(() => 
    filteredTransactions
      .filter(t => t.tipo === 'saída')
      .reduce((sum, t) => sum + (parseFloat(t.valor.toString()) || 0), 0),
    [filteredTransactions]
  );

  const hasFilters = !!searchTerm || !!dateRange;

  return {
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    totalIncome,
    totalExpenses,
    hasFilters
  };
}
