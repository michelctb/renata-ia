
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
    const isOthersCategory = normalizedCategoryFilter.includes("outros");
    
    const filtered = transactions.filter(transaction => {
      // Se a transação não tiver categoria definida, não incluir nos resultados
      if (!transaction.categoria) return false;
      
      const transactionCategory = transaction.categoria.toLowerCase().trim();
      
      // Para a categoria "Outros", incluímos todas as transações que incluem "outros"
      if (isOthersCategory && transactionCategory.includes("outros")) {
        return true;
      }
      
      // Para outras categorias, verificamos se há correspondência exata
      return transactionCategory === normalizedCategoryFilter;
    });
    
    console.log('Número de transações após filtro por categoria:', filtered.length);
    return filtered;
  }, [transactions, categoryFilter]);

  return {
    filteredByCategory
  };
}
