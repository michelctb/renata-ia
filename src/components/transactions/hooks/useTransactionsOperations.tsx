
import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { deleteTransaction, addTransaction, updateTransaction } from '@/lib/supabase/transactions';

type UseTransactionsOperationsProps = {
  clientId?: string;
  userId?: string;  // Adicionando userId às props
  dateRange: DateRange | null;
  filteredTransactions: Transaction[];
  reloadTransactions?: () => Promise<void>;
  onFormSuccess?: () => void;  // Callback para quando o form for submetido com sucesso
  onDeleteSuccess?: () => void;  // Callback para quando a transação for excluída com sucesso
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
};

/**
 * Hook para gerenciar operações relacionadas a transações (adicionar, editar, remover)
 */
export function useTransactionsOperations({
  clientId,
  userId,
  dateRange,
  filteredTransactions,
  reloadTransactions,
  onFormSuccess,
  onDeleteSuccess,
  setTransactions
}: UseTransactionsOperationsProps) {
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para submeter uma transação (nova ou editada)
  const handleSubmitTransaction = useCallback(async (transaction: Transaction) => {
    setIsLoading(true);
    try {
      // Se a transação tem ID, estamos editando
      if (transaction.id) {
        const updatedTransaction = await updateTransaction(transaction);
        
        // Atualizar a lista de transações no estado
        setTransactions(prev => 
          prev.map(t => t.id === transaction.id ? updatedTransaction : t)
        );
        
        toast.success('Transação atualizada com sucesso!');
      } else {
        // Garantir que o id_cliente está definido
        const transactionToAdd = {
          ...transaction,
          id_cliente: userId || clientId
        };
        
        const newTransaction = await addTransaction(transactionToAdd);
        
        // Adicionar nova transação à lista
        setTransactions(prev => [newTransaction, ...prev]);
        
        toast.success('Transação adicionada com sucesso!');
      }
      
      // Chamar callback de sucesso se disponível
      if (onFormSuccess) {
        onFormSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      toast.error('Erro ao salvar transação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [setTransactions, userId, clientId, onFormSuccess]);

  // Funções para manipulação de transações individuais
  const handleTransactionEdit = useCallback((transaction: Transaction) => {
    setTransactionToEdit(transaction);
  }, []);

  const handleDeleteTransaction = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await deleteTransaction(id);
      toast.success('Transação excluída com sucesso!');
      
      // Atualizar a lista de transações removendo a transação excluída
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Chamar callback de sucesso se disponível
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      
      // Se tiver uma função para recarregar transações, chamá-la
      if (reloadTransactions) {
        await reloadTransactions();
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [setTransactions, onDeleteSuccess, reloadTransactions]);

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
    handleDeleteTransaction,
    toggleTransactionSelection,
    clearTransactionSelection,
    handleSubmitTransaction,  // Adicionando ao retorno
    isLoading  // Adicionando ao retorno
  };
}
