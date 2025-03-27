import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Transaction } from '@/lib/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionFiltering } from '../useTransactionFiltering';
import { useTransactionSubmit, useTransactionDelete, useTransactionReload, useBatchEdit } from './index';
import { useCategories } from '@/hooks/categories';
import { useTransactionSelection } from './useTransactionSelection';
import { useTransactionDialogs } from './useTransactionDialogs';

type UseTransactionsTabStateProps = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  dateRange: any;
  setDateRange: React.Dispatch<React.SetStateAction<any>>;
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
  isFormOpen?: boolean;
  setIsFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory?: string | null;
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
  setIsFormOpen: propSetIsFormOpen,
  selectedCategory
}: UseTransactionsTabStateProps) {
  const { user } = useAuth();
  
  // Use hooks específicos
  const {
    editingTransaction, 
    setEditingTransaction,
    transactionToDelete,
    setTransactionToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleAddNew: selectionHandleAddNew,
    handleEdit: selectionHandleEdit,
    handleDeleteRequest: selectionHandleDeleteRequest,
    isUserActive
  } = useTransactionSelection(viewMode);
  
  const localDialogs = useTransactionDialogs();
  
  // Use provided props or local state for form open state
  const isFormOpen = propIsFormOpen !== undefined ? propIsFormOpen : localDialogs.isFormOpen;
  const setIsFormOpen = propSetIsFormOpen || localDialogs.setIsFormOpen;
  
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
  } = useTransactionFiltering(transactions, dateRange, selectedCategory);
  
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

  // Batch edit functionality
  const {
    selectedTransactions,
    isBatchEditOpen,
    isUpdating,
    handleSelectTransaction,
    handleSelectAll,
    openBatchEdit,
    closeBatchEdit,
    processBatchEdit
  } = useBatchEdit({
    setTransactions
  });

  // Carregar categorias para o formulário de edição em lote
  const { categories, isLoading: isLoadingCategories } = useCategories(userId || '');
  
  // Reload when date range changes
  useEffect(() => {
    if (userId) {
      reloadTransactions();
    }
  }, [userId, dateRange]);
  
  // Adaptadores para manter a mesma interface dos métodos originais
  const handleAddNew = () => {
    const result = selectionHandleAddNew();
    if (result) {
      setIsFormOpen(true);
    }
  };
  
  const handleEdit = (transaction: Transaction) => {
    const result = selectionHandleEdit(transaction);
    if (result) {
      setIsFormOpen(true);
    }
  };
  
  const handleDeleteRequest = (id: number) => {
    const transactionId = selectionHandleDeleteRequest(id);
    if (transactionId) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setTransactionToDelete(transaction);
        setDeleteDialogOpen(true);
      }
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
    localDialogs.handleCloseForm();
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const isLoading = isSubmitting || isDeleting || isReloading || isUpdating;
  
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
    selectedCategory,
    
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
    isUserActive,
    
    // View state
    isReadOnly: viewMode === 'consultor',

    // Batch edit
    batchEdit: {
      selectedTransactions,
      isBatchEditOpen,
      handleSelectTransaction,
      handleSelectAll,
      openBatchEdit,
      closeBatchEdit,
      processBatchEdit,
      isUpdating
    },

    // Categories for batch edit form
    categories,
    isLoadingCategories
  };
}
