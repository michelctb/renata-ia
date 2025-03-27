
import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '@/lib/supabase/types';

// Hook para filtrar transações com base em categoria
export function useDrilldownFiltering(
  transactions: Transaction[],
  categoryFilter: string | null
) {
  // Filtra as transações baseado na categoria selecionada
  const filteredByCategory = useMemo(() => {
    if (!categoryFilter) return transactions;
    
    return transactions.filter(transaction => 
      transaction.categoria?.toLowerCase() === categoryFilter.toLowerCase()
    );
  }, [transactions, categoryFilter]);

  return {
    filteredByCategory
  };
}
