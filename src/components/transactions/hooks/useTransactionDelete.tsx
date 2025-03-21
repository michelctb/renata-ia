
import { useState, useRef } from 'react';
import { Transaction } from '@/lib/supabase';
import { deleteTransaction } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type UseTransactionDeleteProps = {
  setDeleteSuccessOpen: (open: boolean) => void;
};

/**
 * Custom hook for managing transaction deletion flow.
 * Handles the deletion request, confirmation, and execution process.
 * 
 * @param {Object} props - The hook's properties
 * @param {Function} props.setDeleteSuccessOpen - Function to set the deletion success dialog state
 * @returns {Object} Object containing deletion state and handlers
 * @property {boolean} deleteConfirmOpen - Whether the delete confirmation dialog is open
 * @property {Function} setDeleteConfirmOpen - Function to set the delete confirmation dialog state
 * @property {number | null} transactionToDelete - ID of the transaction pending deletion
 * @property {Function} handleDeleteRequest - Function to initiate a deletion request
 * @property {Function} confirmDelete - Function to confirm and execute the deletion
 */
export function useTransactionDelete({ setDeleteSuccessOpen }: UseTransactionDeleteProps) {
  const { user } = useAuth();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  
  // Ref to track if callbacks have been executed
  const callbackExecuted = useRef(false);

  /**
   * Initiates a request to delete a transaction.
   * Opens the confirmation dialog.
   * 
   * @param {number} id - The ID of the transaction to delete
   */
  const handleDeleteRequest = (id: number) => {
    console.log('Request to delete transaction ID:', id);
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  /**
   * Confirms and executes the deletion of a transaction.
   * Shows a success dialog on completion.
   */
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
