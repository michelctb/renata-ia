
import { useState } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { DateRange } from 'react-day-picker';
import { useTransactionsTabState } from './transactions/hooks/useTransactionsTabState';
import { TransactionsHeaderContainer } from './transactions/TransactionsHeaderContainer';
import { TransactionTableContainer } from './transactions/TransactionTableContainer';
import { TransactionFormContainer } from './transactions/TransactionFormContainer';
import { DeleteTransactionContainer } from './transactions/DeleteTransactionContainer';
import SummaryCards from './SummaryCards';
import DashboardCharts from './DashboardCharts';

// Types
type TransactionsTabProps = {
  transactions?: Transaction[];
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
  dateRange?: DateRange | undefined;
  setDateRange?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
  isFormOpen?: boolean;
  setIsFormOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Main transactions tab component with state management and layout
 */
const TransactionsTab = ({ 
  transactions: propTransactions, 
  setTransactions: propSetTransactions, 
  dateRange: propDateRange, 
  setDateRange: propSetDateRange,
  clientId,
  viewMode = 'user',
  isFormOpen: propIsFormOpen,
  setIsFormOpen: propSetIsFormOpen
}: TransactionsTabProps) => {
  // Initialize local state if props weren't provided
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { from: startOfMonth, to: endOfMonth };
  });
  const [localIsFormOpen, setLocalIsFormOpen] = useState(false);
  
  // Use provided props or local state
  const transactions = propTransactions !== undefined ? propTransactions : localTransactions;
  const setTransactions = propSetTransactions || setLocalTransactions;
  const dateRange = propDateRange !== undefined ? propDateRange : localDateRange;
  const setDateRange = propSetDateRange || setLocalDateRange;
  const isFormOpen = propIsFormOpen !== undefined ? propIsFormOpen : localIsFormOpen;
  const setIsFormOpen = propSetIsFormOpen || setLocalIsFormOpen;
  
  // Use the custom hook for state and logic
  const {
    userId,
    deleteDialogOpen,
    editingTransaction,
    transactionToDelete,
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    hasFilters,
    totalReceived, 
    totalSpent,
    handleAddNew,
    handleEdit,
    handleDeleteRequest,
    handleConfirmDelete,
    handleCloseForm,
    handleSubmitTransaction,
    setDeleteDialogOpen,
    isUserActive,
    isReadOnly,
    batchEdit,
    categories,
    isLoadingCategories
  } = useTransactionsTabState({
    transactions,
    setTransactions,
    dateRange,
    setDateRange,
    clientId,
    viewMode,
    isFormOpen,
    setIsFormOpen
  });
  
  return (
    <div className="space-y-6">
      {/* Summary Cards with income/expense totals */}
      <SummaryCards transactions={transactions} dateRange={dateRange} />
      
      {/* Charts section */}
      <DashboardCharts 
        transactions={transactions} 
        dateRange={dateRange}
        clientId={clientId}
        viewMode={viewMode}
      />
      
      <TransactionsHeaderContainer 
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onAddNew={handleAddNew}
        isUserActive={isUserActive}
        viewMode={viewMode}
      />
      
      <TransactionTableContainer
        transactions={transactions}
        onEditTransaction={handleEdit}
        onDeleteTransaction={handleDeleteRequest}
        isUserActive={isUserActive}
        isReadOnly={isReadOnly}
        filteringData={{
          searchTerm,
          setSearchTerm,
          filteredTransactions,
          hasFilters,
          totalReceived,
          totalSpent
        }}
        batchEdit={!isReadOnly ? batchEdit : undefined}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
      />
      
      {userId && (
        <TransactionFormContainer
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTransaction}
          editingTransaction={editingTransaction}
          userId={userId}
        />
      )}
      
      <DeleteTransactionContainer
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        transaction={transactionToDelete}
      />
    </div>
  );
};

export default TransactionsTab;
