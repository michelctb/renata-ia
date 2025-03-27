
import { useState } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionSelection } from './useTransactionSelection';
import { useTransactionsFilters } from './useTransactionsFilters';
import { useTransactionsDialogs } from './useTransactionsDialogs';
import { useTransactionsOperations } from './useTransactionsOperations';
import { useBatchEdit } from './useBatchEdit';
import { useCategories } from '@/hooks/categories';

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
 * Hook principal que encapsula o estado e a lógica do componente TransactionsTab.
 * Coordena os hooks especializados.
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
  
  // Obter o ID do usuário correto com base no modo de visualização
  const userId = (viewMode === 'consultor' && clientId) ? clientId : user?.id;
  
  // Hook para selecionar transações
  const {
    editingTransaction, 
    setEditingTransaction,
    transactionToDelete,
    setTransactionToDelete,
    handleAddNew: selectionHandleAddNew,
    handleEdit: selectionHandleEdit,
    handleDeleteRequest: selectionHandleDeleteRequest,
    isUserActive
  } = useTransactionSelection(viewMode);
  
  // Hook para gerenciar diálogos
  const dialogStates = useTransactionsDialogs({
    isFormOpen: propIsFormOpen,
    setIsFormOpen: propSetIsFormOpen
  });
  
  const {
    isFormOpen,
    setIsFormOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleCloseForm
  } = dialogStates;
  
  // Hook para filtrar transações
  const filteringData = useTransactionsFilters({
    transactions,
    dateRange,
    setDateRange,
    selectedCategory
  });
  
  const {
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    hasFilters,
    totalReceived,
    totalSpent
  } = filteringData;
  
  // Hook para operações CRUD
  const operations = useTransactionsOperations({
    userId,
    clientId,
    dateRange,
    filteredTransactions,
    setTransactions,
    onFormSuccess: () => {
      setIsFormOpen(false);
      setEditingTransaction(null);
    },
    onDeleteSuccess: () => {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  });
  
  const {
    handleSubmitTransaction,
    handleDeleteTransaction,
    isLoading
  } = operations;

  // Hook para edição em lote
  const batchEditState = useBatchEdit({
    setTransactions
  });

  // Carregar categorias para o formulário de edição em lote
  const { categories, isLoading: isLoadingCategories } = useCategories(userId || '');
  
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
  
  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      await handleDeleteTransaction(transactionToDelete.id as number);
    }
  };

  return {
    // Estado
    userId,
    isFormOpen,
    deleteDialogOpen,
    editingTransaction,
    transactionToDelete,
    isLoading,
    
    // Dados de filtragem
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
    
    // Estado do usuário
    isUserActive,
    
    // Estado da visualização
    isReadOnly: viewMode === 'consultor',

    // Edição em lote
    batchEdit: batchEditState,

    // Categorias para o formulário de edição em lote
    categories,
    isLoadingCategories
  };
}
