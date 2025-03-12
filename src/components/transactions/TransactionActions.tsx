import { useState } from 'react';
import { Transaction } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type TransactionActionsProps = {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onCloseForm: () => void;
};

export function useTransactionActions({ 
  setTransactions, 
  onCloseForm 
}: TransactionActionsProps) {
  const { user } = useAuth();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

  // Handle adding or updating a transaction
  const handleSubmitTransaction = async (transaction: Transaction) => {
    if (!user) {
      toast.error('Você precisa estar logado para realizar esta operação.');
      return;
    }
    
    try {
      console.log('Processing transaction:', transaction);
      console.log('Processing transaction with user ID:', user.id);
      
      // Garantir que todos os campos obrigatórios estejam presentes
      if (!transaction.data || !transaction.descrição || !transaction.operação || !transaction.categoria) {
        console.error('Dados de transação incompletos:', transaction);
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      // Normalize the operation type to lowercase
      let operationType = transaction.operação;
      if (operationType) {
        if (operationType.toLowerCase() === 'entrada' || operationType.toLowerCase() === 'saída') {
          operationType = operationType.toLowerCase();
        }
      }
      
      // Garantir que o cliente está definido corretamente
      const transactionWithClient = {
        ...transaction,
        cliente: user.id,
        operação: operationType
      };
      
      console.log('Final transaction to submit:', transactionWithClient);
      
      if (transaction.id) {
        // Update existing transaction
        console.log('Updating transaction with ID:', transaction.id);
        const updated = await updateTransaction(transactionWithClient);
        console.log('Updated transaction:', updated);
        
        if (updated) {
          setTransactions(prev => 
            prev.map(t => (t.id === transaction.id ? updated : t))
          );
          toast.success('Transação atualizada com sucesso!');
          onCloseForm();
        }
      } else {
        // Add new transaction - ensure we're not sending an ID
        console.log('Adding new transaction without ID');
        const { id, ...transactionWithoutId } = transactionWithClient;
        
        const added = await addTransaction(transactionWithoutId as Transaction);
        console.log('Added transaction:', added);
        
        if (added) {
          setTransactions(prev => [added, ...prev]);
          toast.success('Transação adicionada com sucesso!');
          onCloseForm();
        }
      }
    } catch (error) {
      console.error('Error with transaction:', error);
      toast.error('Erro ao salvar a transação. Tente novamente.');
    }
  };

  // Request to delete a transaction
  const handleDeleteRequest = (id: number) => {
    console.log('Request to delete transaction ID:', id);
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Confirm deletion of a transaction
  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    
    try {
      console.log('Confirming deletion of transaction ID:', transactionToDelete);
      const success = await deleteTransaction(transactionToDelete);
      
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== transactionToDelete));
        toast.success('Transação excluída com sucesso!');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao excluir a transação. Tente novamente.');
    } finally {
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
    }
  };

  return {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    transactionToDelete,
    handleSubmitTransaction,
    handleDeleteRequest,
    confirmDelete
  };
}
