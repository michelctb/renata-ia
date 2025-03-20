
import { useState, useRef } from 'react';
import { Transaction } from '@/lib/supabase';
import { deleteTransaction } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type UseTransactionDeleteProps = {
  setDeleteSuccessOpen: (open: boolean) => void;
};

export function useTransactionDelete({ setDeleteSuccessOpen }: UseTransactionDeleteProps) {
  const { user } = useAuth();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  
  // Ref to track if callbacks have been executed
  const callbackExecuted = useRef(false);

  // Request to delete a transaction
  const handleDeleteRequest = (id: number) => {
    console.log('Request to delete transaction ID:', id);
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Confirm deletion of a transaction
  const confirmDelete = async () => {
    if (!transactionToDelete || !user) {
      console.error('No transaction ID to delete or user not logged in');
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
        console.log('Transaction deletion successful, showing confirmation dialog');
        
        // Clear the transactionToDelete state after deletion
        setTransactionToDelete(null);
        
        // Show success confirmation dialog
        setDeleteSuccessOpen(true);
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
    handleDeleteRequest,
    confirmDelete
  };
}
