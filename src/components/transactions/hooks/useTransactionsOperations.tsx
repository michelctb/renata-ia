
import { useEffect } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionSubmit } from './useTransactionSubmit';
import { useTransactionDelete } from './useTransactionDelete';
import { useTransactionReload } from './useTransactionReload';

type UseTransactionsOperationsProps = {
  userId: string;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  dateRange: DateRange | null;
  onFormSuccess?: () => void;
  onDeleteSuccess?: () => void;
};

/**
 * Hook para gerenciar operações CRUD de transações
 */
export function useTransactionsOperations({
  userId,
  setTransactions,
  dateRange,
  onFormSuccess,
  onDeleteSuccess
}: UseTransactionsOperationsProps) {
  // Hooks para submissão, exclusão e recarregamento
  const { 
    handleSubmitTransaction, 
    isSubmitting 
  } = useTransactionSubmit({
    userId: userId || '',
    setTransactions,
    onSuccess: onFormSuccess
  });
  
  const { 
    handleDeleteTransaction,
    isDeleting
  } = useTransactionDelete({
    setTransactions,
    onSuccess: onDeleteSuccess
  });
  
  const {
    reloadTransactions,
    isReloading
  } = useTransactionReload({
    userId: userId || '',
    setTransactions
  });

  // Recarregar transações quando o intervalo de datas mudar
  useEffect(() => {
    if (userId) {
      reloadTransactions();
    }
  }, [userId, dateRange]);

  // Estado geral de carregamento
  const isLoading = isSubmitting || isDeleting || isReloading;

  return {
    handleSubmitTransaction,
    handleDeleteTransaction,
    reloadTransactions,
    isLoading,
    isSubmitting,
    isDeleting,
    isReloading
  };
}
