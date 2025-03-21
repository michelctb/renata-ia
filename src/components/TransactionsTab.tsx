
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
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

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
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
    filteredTransactions: baseFilteredTransactions,
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
    isReadOnly
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

  // Apply additional category filter if one is selected
  const filteredTransactions = selectedCategory
    ? baseFilteredTransactions.filter(t => t.categoria === selectedCategory)
    : baseFilteredTransactions;
  
  // Handle category selection from charts
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    // Optional: adjust the searchTerm to be empty when selecting a category
    if (category) {
      setSearchTerm('');
    }
  };
  
  // Clear category filter
  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };
  
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
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      {/* Active category filter indicator */}
      {selectedCategory && (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-center">
          <span className="mr-2 text-sm text-muted-foreground">Filtrando por categoria:</span>
          <Badge className="bg-primary font-medium">
            {selectedCategory}
            <button 
              className="ml-1 hover:text-gray-200" 
              onClick={clearCategoryFilter}
              aria-label="Limpar filtro de categoria"
            >
              <X size={14} />
            </button>
          </Badge>
        </div>
      )}
      
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
          hasFilters: hasFilters || !!selectedCategory,
          totalReceived,
          totalSpent
        }}
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
