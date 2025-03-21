
import { useState, useMemo } from 'react';
import { Transaction } from './TransactionRow';

export function useTransactionFiltering(transactions: Transaction[]) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) {
      return transactions;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    return transactions.filter(transaction => {
      // Support both legacy and new field names
      const description = (transaction.description || transaction.descricao || '').toLowerCase();
      const category = (transaction.category || '').toLowerCase();
      const paymentMethod = (transaction.payment_method || transaction.forma_pagamento || '').toLowerCase();
      
      // Check if any field contains the search term
      return (
        description.includes(normalizedSearchTerm) ||
        category.includes(normalizedSearchTerm) ||
        paymentMethod.includes(normalizedSearchTerm)
      );
    });
  }, [transactions, searchTerm]);

  // Check if any filters are applied
  const hasFilters = searchTerm.trim().length > 0;

  // Calculate totals for income and expense transactions
  const { totalReceived, totalSpent } = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const type = transaction.type || (transaction.tipo === 'entrada' ? 'income' : 'expense');
        
        if (type === 'income' || transaction.tipo === 'entrada') {
          acc.totalReceived += transaction.value;
        } else if (type === 'expense' || transaction.tipo === 'saída') {
          acc.totalSpent += transaction.value;
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
