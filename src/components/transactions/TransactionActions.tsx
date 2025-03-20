
import { Transaction } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionSubmit } from './hooks/useTransactionSubmit';
import { useTransactionDelete } from './hooks/useTransactionDelete';
import { useTransactionReload } from './hooks/useTransactionReload';

type TransactionActionsProps = {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onCloseForm: () => void;
};

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
  
  // Wrapper function for delete request that checks active status
  const handleDeleteWrapper = (id: number) => {
    if (!user) {
      toast.error('Você precisa estar logado para realizar esta operação.');
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
