
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction } from '@/lib/supabase/types';
import TransactionTable from './TransactionTable';
import { TransactionFormDialog } from './transactions/TransactionFormDialog';
import { TransactionsHeader } from './transactions/TransactionsHeader';
import { DeleteTransactionDialog } from './transactions/DeleteTransactionDialog';
import { useTransactionFiltering } from './transactions/useTransactionFiltering';
import { 
  useTransactionSubmit,
  useTransactionDelete,
  useTransactionReload
} from './transactions/hooks';

// Types
type TransactionsTabProps = {
  transactions?: Transaction[];
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
  dateRange?: DateRange | undefined;
  setDateRange?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
};

const TransactionsTab = ({ 
  transactions: propTransactions, 
  setTransactions: propSetTransactions, 
  dateRange: propDateRange, 
  setDateRange: propSetDateRange,
  clientId,
  viewMode = 'user'
}: TransactionsTabProps) => {
  const { user, isUserActive } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Initialize local state if props weren't provided
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { from: startOfMonth, to: endOfMonth };
  });
  
  // Use provided props or local state
  const transactions = propTransactions !== undefined ? propTransactions : localTransactions;
  const setTransactions = propSetTransactions || setLocalTransactions;
  const dateRange = propDateRange !== undefined ? propDateRange : localDateRange;
  const setDateRange = propSetDateRange || setLocalDateRange;
  
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
  
  return (
    <div className="space-y-6">
      <TransactionsHeader 
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onAddNew={handleAddNew}
        isUserActive={isUserActive()}
        viewMode={viewMode}
      />
      
      <TransactionTable 
        transactions={transactions}
        onEditTransaction={handleEdit}
        onDeleteTransaction={handleDeleteRequest}
        isUserActive={isUserActive()}
        isReadOnly={viewMode === 'consultor'}
        filteringData={{
          searchTerm,
          setSearchTerm,
          filteredTransactions,
          hasFilters,
          totalReceived,
          totalSpent
        }}
      />
      
      {userId && (
        <TransactionFormDialog
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTransaction}
          editingTransaction={editingTransaction}
          userId={userId}
        />
      )}
      
      <DeleteTransactionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        transaction={transactionToDelete}
      />
    </div>
  );
};

export default TransactionsTab;
