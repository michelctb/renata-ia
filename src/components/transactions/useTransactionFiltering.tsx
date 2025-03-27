
import { useState, useMemo } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { DateRange } from 'react-day-picker';
import { parseISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

/**
 * Custom hook for filtering transactions based on search term, date range, and category
 * 
 * @param {Transaction[]} transactions - The list of transactions to filter
 * @param {DateRange | undefined} dateRange - The optional date range to filter by
 * @param {string | null} selectedCategory - The optional category to filter by
 * @returns {Object} Object containing filtered transactions and filtering state
 */
export function useTransactionFiltering(
  transactions: Transaction[],
  dateRange?: DateRange | undefined,
  selectedCategory?: string | null
) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Log para debug
  console.log('useTransactionFiltering - selectedCategory:', selectedCategory);
  console.log('useTransactionFiltering - total transactions:', transactions.length);
  console.log('useTransactionFiltering - dateRange:', dateRange);
  
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    // Filter by date range if provided
    if (dateRange?.from) {
      console.log('Filtrando por intervalo de datas:', dateRange);
      
      const fromDate = startOfDay(toZonedTime(dateRange.from, TIMEZONE));
      const toDate = dateRange.to 
        ? endOfDay(toZonedTime(dateRange.to, TIMEZONE))
        : endOfDay(toZonedTime(dateRange.from, TIMEZONE));
      
      console.log('Intervalo normalizado:', {
        de: fromDate.toISOString(),
        ate: toDate.toISOString()
      });
      
      filtered = filtered.filter(transaction => {
        try {
          // Parse a data da string para um objeto Date no fuso horário UTC
          const transactionDateStr = transaction.data;
          const transactionDateUTC = parseISO(transactionDateStr);
          
          // Converte para o fuso horário desejado (America/Sao_Paulo)
          const transactionDateSaoPaulo = toZonedTime(transactionDateUTC, TIMEZONE);
          
          // Normaliza para o início do dia no fuso horário de São Paulo
          const transactionDate = startOfDay(transactionDateSaoPaulo);
          
          // Verificar se a data da transação está dentro do intervalo
          const result = isWithinInterval(transactionDate, {
            start: fromDate,
            end: toDate
          });
          
          if (!result) {
            console.log(`Transação fora do intervalo: ID=${transaction.id}, data=${transaction.data} (${transactionDate.toISOString()})`);
          }
          
          return result;
        } catch (error) {
          console.error('Erro ao processar data para filtragem:', transaction.data, error);
          return false;
        }
      });
      
      console.log('Após filtro de data, restaram:', filtered.length, 'transações');
    }
    
    // Filter by category if selected
    if (selectedCategory) {
      console.log('Filtrando por categoria:', selectedCategory);
      filtered = filtered.filter(transaction => {
        // Verificar se a categoria da transação existe e não é nula
        if (!transaction.categoria) return false;
        
        const transactionCategory = transaction.categoria.toLowerCase().trim();
        const categoryToMatch = selectedCategory.toLowerCase().trim();
        
        // Verificar se a categoria corresponde exatamente à categoria selecionada
        // Ignorar a parte "(X)" em "Outros (X)" se existir
        const isMatchingCategory = 
          transactionCategory === categoryToMatch || 
          (categoryToMatch.startsWith('outros') && transactionCategory.startsWith('outros'));
        
        return isMatchingCategory;
      });
      console.log('Após filtro de categoria, restaram:', filtered.length, 'transações');
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
      
      console.log('Após filtro de busca, restaram:', filtered.length, 'transações');
    }
    
    return filtered;
  }, [transactions, searchTerm, dateRange, selectedCategory]);

  // Check if any filters are applied
  const hasFilters = searchTerm.trim().length > 0 || 
                    (dateRange?.from !== undefined) ||
                    !!selectedCategory;

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
    totalSpent,
    selectedCategory
  };
}
