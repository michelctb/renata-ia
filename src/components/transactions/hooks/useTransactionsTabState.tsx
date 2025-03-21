
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Transaction } from '@/lib/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionFiltering } from '../useTransactionFiltering';
import { useTransactionSubmit, useTransactionDelete, useTransactionReload } from './index';

type UseTransactionsTabStateProps = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  dateRange: any;
  setDateRange: React.Dispatch<React.SetStateAction<any>>;
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
  isFormOpen?: boolean;
  setIsFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Custom hook that encapsulates the state and logic for the TransactionsTab component.
 */
export function useTransactionsTabState({
  transactions,
  setTransactions,
  dateRange,
  setDateRange,
  clientId,
  viewMode = 'user',
  isFormOpen: propIsFormOpen,
  setIsFormOpen: propSetIsFormOpen
}: UseTransactionsTabStateProps) {
  const { user, isUserActive } = useAuth();
  const [localIsFormOpen, setLocalIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Use provided props or local state for form open state
  const isFormOpen = propIsFormOpen !== undefined ? propIsFormOpen : localIsFormOpen;
  const setIsFormOpen = propSetIsFormOpen || setLocalIsFormOpen;
  
  // Get the correct user ID based on view mode
  const userId = (viewMode === 'consultor' && clientId) ? clientId : user?.id;
  
  // Custom hooks for transaction management
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredTransactions,
    hasFilters,
    totalReceived,
    totalSpent
  } = useTransactionFiltering(transactions, dateRange);
  
  const { 
    handleSubmitTransaction, 
    isSubmitting 
  } = useTransactionSubmit({
    userId: userId || '',
    setTransactions,
    onSuccess: () => {
      setIsFormOpen(false);
      setEditingTransaction(null);
    }
  });
  
  const { 
    handleDeleteTransaction,
    isDeleting
  } = useTransactionDelete({
    setTransactions,
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  });
  
  const {
    reloadTransactions,
    isReloading
  } = useTransactionReload({
    userId: userId || '',
    setTransactions
  });
  
  // Reload when date range changes
  useEffect(() => {
    if (userId) {
      reloadTransactions();
    }
  }, [userId, dateRange]);
  
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
    setIsFormOpen(true);
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
    setIsFormOpen(true);
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
    
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setTransactionToDelete(transaction);
      setDeleteDialogOpen(true);
    }
  };
  
  // Confirm delete
  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      await handleDeleteTransaction(transactionToDelete.id as number);
    }
  };
  
  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const isLoading = isSubmitting || isDeleting || isReloading;
  
  return {
    // State
    userId,
    isFormOpen,
    deleteDialogOpen,
    editingTransaction,
    transactionToDelete,
    isLoading,
    
    // Filtering data
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    hasFilters,
    totalReceived,
    totalSpent,
    
    // Handlers
    handleAddNew,
    handleEdit,
    handleDeleteRequest,
    handleConfirmDelete,
    handleCloseForm,
    handleSubmitTransaction,
    
    // Setters
    setDeleteDialogOpen,
    setIsFormOpen,
    
    // User state
    isUserActive: isUserActive(),
    
    // View state
    isReadOnly: viewMode === 'consultor'
  };
}
