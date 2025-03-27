
import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { deleteTransaction } from '@/lib/supabase/transactions';

type UseTransactionsOperationsProps = {
  clientId?: string;
  dateRange: DateRange | null;
  filteredTransactions: Transaction[];
  reloadTransactions: () => Promise<void>;
};

/**
 * Hook para gerenciar operações relacionadas a transações (adicionar, editar, remover)
 */
export function useTransactionsOperations({
  clientId,
  dateRange,
  filteredTransactions,
  reloadTransactions
}: UseTransactionsOperationsProps) {
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);

  // Funções para manipulação de transações individuais
  const handleTransactionEdit = useCallback((transaction: Transaction) => {
    setTransactionToEdit(transaction);
  }, []);

  const handleTransactionDelete = useCallback(async (transaction: Transaction) => {
    try {
      await deleteTransaction(transaction.id!);
      toast.success('Transação excluída com sucesso!');
      reloadTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação. Tente novamente.');
    }
  }, [reloadTransactions]);

  // Funções para lidar com seleção em lote
  const toggleTransactionSelection = useCallback((transaction: Transaction) => {
    setSelectedTransactions(prev => {
      // Verifica se a transação já está selecionada
      const isSelected = prev.some(t => t.id === transaction.id);
      
      // Se já estiver selecionada, remove da lista
      if (isSelected) {
        return prev.filter(t => t.id !== transaction.id);
      }
      
      // Se não estiver selecionada, adiciona à lista
      return [...prev, transaction];
    });
  }, []);

  const clearTransactionSelection = useCallback(() => {
    setSelectedTransactions([]);
  }, []);

  return {
    transactionToEdit,
    setTransactionToEdit,
    transactionToDelete,
    setTransactionToDelete,
    selectedTransactions,
    handleTransactionEdit,
    handleTransactionDelete,
    toggleTransactionSelection,
    clearTransactionSelection
  };
}
