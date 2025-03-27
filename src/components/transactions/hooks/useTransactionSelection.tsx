
import { useState } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useTransactionSelection(
  viewMode: 'user' | 'admin' | 'consultor' = 'user'
) {
  const { isUserActive } = useAuth();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Open form for new transaction
  const handleAddNew = () => {
    if (!isUserActive()) {
      toast.error('Sua conta está inativa. Por favor, atualize seu plano para continuar.');
      return;
    }
    
    // Disable adding in consultor view
    if (viewMode === 'consultor') {
      return;
    }
    
    setEditingTransaction(null);
    return true; // Indica que a ação foi bem-sucedida
  };
  
  // Open form to edit transaction
  const handleEdit = (transaction: Transaction) => {
    if (!isUserActive()) {
      toast.error('Sua conta está inativa. Por favor, atualize seu plano para continuar.');
      return;
    }
    
    // Disable editing in consultor view
    if (viewMode === 'consultor') {
      return;
    }
    
    setEditingTransaction(transaction);
    return true; // Indica que a ação foi bem-sucedida
  };
  
  // Request to delete transaction
  const handleDeleteRequest = (id: number) => {
    if (!isUserActive()) {
      toast.error('Sua conta está inativa. Por favor, atualize seu plano para continuar.');
      return;
    }
    
    // Disable deleting in consultor view
    if (viewMode === 'consultor') {
      return;
    }
    
    return id; // Retorna o ID para ser buscado depois
  };
  
  return {
    editingTransaction,
    setEditingTransaction,
    transactionToDelete,
    setTransactionToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleAddNew,
    handleEdit,
    handleDeleteRequest,
    isUserActive: isUserActive()
  };
}
