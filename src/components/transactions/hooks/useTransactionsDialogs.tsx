
import { useState } from 'react';
import { Transaction } from '@/lib/supabase/types';

type UseTransactionsDialogsProps = {
  isFormOpen?: boolean;
  setIsFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Hook para gerenciar o estado de diálogos relacionados a transações
 */
export function useTransactionsDialogs({
  isFormOpen: propIsFormOpen,
  setIsFormOpen: propSetIsFormOpen
}: UseTransactionsDialogsProps = {}) {
  // Estados locais para formulário e diálogo de exclusão
  const [localIsFormOpen, setLocalIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Use provided props or local state for form open state
  const isFormOpen = propIsFormOpen !== undefined ? propIsFormOpen : localIsFormOpen;
  const setIsFormOpen = propSetIsFormOpen || setLocalIsFormOpen;
  
  // Fechamento do formulário
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return {
    isFormOpen,
    setIsFormOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleCloseForm
  };
}
