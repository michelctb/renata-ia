
import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { DateRange } from 'react-day-picker';
import { useTransactionFiltering } from '../useTransactionFiltering';

type UseTransactionsFiltersProps = {
  transactions: Transaction[];
  dateRange: DateRange | null;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | null>>;
  selectedCategory?: string | null;
};

/**
 * Hook para gerenciar filtros de transações (busca, data e categoria)
 */
export function useTransactionsFilters({
  transactions,
  dateRange,
  setDateRange,
  selectedCategory
}: UseTransactionsFiltersProps) {
  // Filtros
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredTransactions,
    hasFilters,
    totalReceived,
    totalSpent
  } = useTransactionFiltering(transactions, dateRange, selectedCategory);

  return {
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    hasFilters,
    totalReceived,
    totalSpent,
    selectedCategory
  };
}
