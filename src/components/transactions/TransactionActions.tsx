import { useState, useRef } from 'react';
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
  
  // Ref to track if callbacks have been executed
  const callbackExecuted = useRef(false);

  // Handle adding or updating a transaction
  const handleSubmitTransaction = async (transaction: Transaction) => {
    if (!user) {
      toast.error('Você precisa estar logado para realizar esta operação.');
      return;
    }
    
    try {
      console.log('Processing transaction:', transaction);
      console.log('Processing transaction with user ID:', user.id);
      
      // Reset callback executed flag
      callbackExecuted.current = false;
      
      // Garantir que todos os campos obrigatórios estejam presentes
      if (!transaction.data || !transaction.descrição || !transaction.operação || !transaction.categoria) {
        console.error('Dados de transação incompletos:', transaction);
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      // Normalize the operation type to lowercase for consistency
      let operationType = transaction.operação.toLowerCase();
      
      // Ensure it's one of our allowed types
      if (operationType === 'entrada' || operationType === 'saída') {
        // Create a new transaction object with the normalized operation
        const transactionWithClient = {
          ...transaction,
          id_cliente: user.id, // Make sure id_cliente is properly set
          operação: operationType as 'entrada' | 'saída'
        };
        
        console.log('Final transaction to submit:', transactionWithClient);
        
        if (transaction.id) {
          // Update existing transaction
          console.log('Updating transaction with ID:', transaction.id);
          const updated = await updateTransaction(transactionWithClient);
          console.log('Updated transaction:', updated);
          
          if (updated) {
            console.log('Setting updated transaction in state');
            
            // Close form first to prevent UI issues
            if (!callbackExecuted.current) {
              callbackExecuted.current = true;
              onCloseForm();
            }
            
            // Then update the state
            setTimeout(() => {
              setTransactions(prev => {
                // Create a new array with the updated transaction
                const newTransactions = prev.map(t => 
                  t.id === transaction.id ? updated : t
                );
                console.log('New transactions array after update:', newTransactions.length);
                return newTransactions;
              });
              toast.success('Transação atualizada com sucesso!');
            }, 50);
          } else {
            console.error('No updated transaction returned from the API');
            toast.error('Erro ao atualizar a transação. Tente novamente.');
          }
        } else {
          // Add new transaction - ensure we're not sending an ID
          console.log('Adding new transaction without ID');
          const { id, ...transactionWithoutId } = transactionWithClient;
          
          const added = await addTransaction(transactionWithoutId as Transaction);
          console.log('Added transaction:', added);
          
          if (added) {
            console.log('Setting added transaction in state');
            
            // Close form first to prevent UI issues
            if (!callbackExecuted.current) {
              callbackExecuted.current = true;
              onCloseForm();
            }
            
            // Then update the state
            setTimeout(() => {
              setTransactions(prev => {
                // Create a new array with the added transaction at the beginning
                const newTransactions = [added, ...prev];
                console.log('New transactions array after add:', newTransactions.length);
                return newTransactions;
              });
              toast.success('Transação adicionada com sucesso!');
            }, 50);
          } else {
            console.error('No added transaction returned from the API');
            toast.error('Erro ao adicionar a transação. Tente novamente.');
          }
        }
      } else {
        console.error('Tipo de operação inválido:', operationType);
        toast.error('Tipo de operação inválido. Use "entrada" ou "saída".');
      }
    } catch (error) {
      console.error('Error with transaction:', error);
      toast.error('Erro ao salvar a transação. Tente novamente.');
      // Don't close the form on error
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
    if (!transactionToDelete) {
      console.error('No transaction ID to delete');
      return;
    }
    
    // Reset callback executed flag
    callbackExecuted.current = false;
    
    try {
      console.log('Confirming deletion of transaction ID:', transactionToDelete);
      
      // Save transactionId to a local variable since we'll clear state
      const transactionId = transactionToDelete;
      
      // Close dialog first to prevent UI issues - this is already handled in DeleteTransactionDialog
      
      const success = await deleteTransaction(transactionId);
      
      if (success) {
        console.log('Setting state after transaction deletion');
        setTimeout(() => {
          setTransactions(prev => {
            // Create a new array without the deleted transaction
            const newTransactions = prev.filter(t => t.id !== transactionId);
            console.log('New transactions array after delete:', newTransactions.length);
            return newTransactions;
          });
          // Clear the transactionToDelete state after deletion
          setTransactionToDelete(null);
          toast.success('Transação excluída com sucesso!');
        }, 50);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao excluir a transação. Tente novamente.');
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
