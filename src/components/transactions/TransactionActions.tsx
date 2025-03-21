
import { Transaction } from '@/lib/supabase/types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useTransactionSubmit } from './hooks/useTransactionSubmit';
import { useTransactionDelete } from './hooks/useTransactionDelete';
import { useTransactionReload } from './hooks/useTransactionReload';

type TransactionActionsProps = {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onCloseForm: () => void;
};

/**
 * Custom hook that centralizes transaction-related actions.
 * Combines submission, deletion, and reload functionality in one place.
 * 
 * @param {Object} props - The hook's properties
 * @param {Function} props.setTransactions - Function to update the transactions list
 * @param {Function} props.onCloseForm - Function to close the transaction form
 * @returns {Object} Object containing transaction action handlers and state
 */
export function useTransactionActions({ 
  setTransactions, 
  onCloseForm 
}: TransactionActionsProps) {
  const { user } = useAuth();
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  
  const { reloadTransactions, isReloading } = useTransactionReload({
    userId: user?.id || '',
    setTransactions
  });
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  
  const { handleDeleteTransaction, isDeleting } = useTransactionDelete({
    setTransactions,
    onSuccess: () => {
      setDeleteSuccessOpen(true);
    }
  });
  
  const handleReloadAfterDelete = () => {
    setDeleteSuccessOpen(false);
    reloadTransactions();
  };
  
  const { handleSubmitTransaction, isSubmitting } = useTransactionSubmit({ 
    userId: user?.id || '',
    setTransactions, 
    onSuccess: onCloseForm
  });
  
  /**
   * Request to delete a transaction by ID
   */
  const handleDeleteRequest = (id: number) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Você precisa estar logado para realizar esta operação.",
        variant: "destructive"
      });
      return;
    }
    
    const transaction = transactionToDelete;
    if (transaction && transaction.id === id) {
      setTransactionToDelete(transaction);
      setDeleteConfirmOpen(true);
    }
  };
  
  /**
   * Confirm deletion of the transaction
   */
  const confirmDelete = async () => {
    if (transactionToDelete) {
      await handleDeleteTransaction(transactionToDelete.id as number);
    }
  };

  return {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteSuccessOpen,
    setDeleteSuccessOpen,
    transactionToDelete,
    handleSubmitTransaction,
    handleDeleteRequest,
    confirmDelete,
    handleReloadAfterDelete,
    isDeleting,
    isSubmitting,
    isReloading
  };
}
