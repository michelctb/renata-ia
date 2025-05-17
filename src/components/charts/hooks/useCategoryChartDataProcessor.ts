
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';

/**
 * Hook para processar dados para o gráfico de categorias
 */
export function useCategoryChartDataProcessor(
  filteredTransactions: Transaction[], 
  transactionType: 'saída' | 'entrada'
) {
  return useMemo(() => {
    // Garantir que temos transações válidas para processar
    if (!Array.isArray(filteredTransactions) || filteredTransactions.length === 0) {
      return [];
    }
    
    const categories = new Map();
    
    // Process transactions based on selected transaction type with case-insensitive check
    filteredTransactions
      .filter(t => {
        const opType = t.operação?.toLowerCase() || '';
        return opType === transactionType || opType === transactionType.replace('í', 'i');
      })
      .forEach(transaction => {
        // Handle empty or undefined category
        const category = transaction.categoria?.trim() || 'Sem categoria';
        
        if (!categories.has(category)) {
          categories.set(category, { 
            name: category, 
            value: 0 
          });
        }
        
        const categoryData = categories.get(category);
        categoryData.value += Number(transaction.valor || 0);
      });
    
    // Convert the Map to Array and sort by value (highest first)
    return Array.from(categories.values())
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, transactionType]);
}
