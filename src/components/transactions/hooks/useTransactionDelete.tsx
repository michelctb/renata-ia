
import { useState, useRef } from 'react';
import { Transaction, deleteTransaction } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type UseTransactionDeleteProps = {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onSuccess?: () => void;
};

/**
 * Custom hook for managing transaction deletion flow.
 * Handles the deletion request, confirmation, and execution process.
 * 
 * @param {Object} props - The hook's properties
 * @param {Function} props.setTransactions - Function to update the transactions list
 * @param {Function} props.onSuccess - Function called on successful deletion
 * @returns {Object} Object containing deletion state and handlers
 */
export function useTransactionDelete({ 
  setTransactions,
  onSuccess
}: UseTransactionDeleteProps) {
  const { user } = useAuth();
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Ref to track if callbacks have been executed
  const callbackExecuted = useRef(false);

  /**
   * Deletes a transaction by ID
   * Updates state after successful deletion
   * 
   * @param {number} id - The ID of the transaction to delete
   */
  const handleDeleteTransaction = async (id: number) => {
    if (!id) {
      console.error('No transaction ID to delete');
      return;
    }
    
    setIsDeleting(true);
    
    try {
      console.log('Deleting transaction ID:', id);
      
      const success = await deleteTransaction(id);
      
      if (success) {
        console.log('Transaction deletion successful');
        
        // Update the transactions list by filtering out the deleted one
        setTransactions(prev => prev.filter(t => t.id !== id));
        
        // Call onSuccess callback if provided
        if (onSuccess && !callbackExecuted.current) {
          callbackExecuted.current = true;
          onSuccess();
        }
        
        toast.success('Transação excluída com sucesso!');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao excluir a transação. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDeleteTransaction,
    isDeleting
  };
}
