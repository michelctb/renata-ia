
import { Transaction } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
  const { deleteSuccessOpen, setDeleteSuccessOpen, handleReloadAfterDelete } = useTransactionReload();
  
  const { 
    deleteConfirmOpen, 
    setDeleteConfirmOpen,
    transactionToDelete,
    handleDeleteRequest,
    confirmDelete
  } = useTransactionDelete({ 
    setDeleteSuccessOpen 
  });
  
  const { handleSubmitTransaction } = useTransactionSubmit({ 
    setTransactions, 
    onCloseForm 
  });
  
  /**
   * Wrapper function for delete request that checks active status.
   * Verifies that the user is logged in before proceeding.
   * 
   * @param {number} id - The ID of the transaction to delete
   */
  const handleDeleteWrapper = (id: number) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Você precisa estar logado para realizar esta operação.",
        variant: "destructive"
      });
      return;
    }
    
    handleDeleteRequest(id);
  };

  return {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteSuccessOpen,
    setDeleteSuccessOpen,
    transactionToDelete,
    handleSubmitTransaction,
    handleDeleteRequest: handleDeleteWrapper,
    confirmDelete,
    handleReloadAfterDelete
  };
}
