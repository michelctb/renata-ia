
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase/types';

// Hook para filtrar transações com base em categoria
export function useDrilldownFiltering(
  transactions: Transaction[],
  categoryFilter: string | null
) {
  // Filtra as transações baseado na categoria selecionada
  const filteredByCategory = useMemo(() => {
    if (!categoryFilter) return transactions;
    
    console.log('Filtrando transações pela categoria:', categoryFilter);
    console.log('Número de transações antes do filtro:', transactions.length);
    
    // Verificação de caracteres especiais no nome da categoria
    const normalizedCategoryFilter = categoryFilter.toLowerCase().trim();
    
    // Se a categoria for "Outros", precisa tratar de forma especial
    if (normalizedCategoryFilter.startsWith("outros")) {
      console.log('Filtrando categoria especial "Outros"');
      // Não podemos filtrar por "Outros" já que é uma categoria agregada
      return transactions;
    }
    
    const filtered = transactions.filter(transaction => {
      const transactionCategory = transaction.categoria?.toLowerCase().trim() || '';
      const isMatch = transactionCategory === normalizedCategoryFilter;
      return isMatch;
    });
    
    console.log('Número de transações após filtro por categoria:', filtered.length);
    return filtered;
  }, [transactions, categoryFilter]);

  return {
    filteredByCategory
  };
}
