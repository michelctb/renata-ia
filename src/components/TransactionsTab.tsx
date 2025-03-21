
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/lib/supabase';
import { fetchTransactionsByClientId } from '@/lib/supabase/transactions';
import SummaryCards from '@/components/SummaryCards';
import DashboardCharts from '@/components/DashboardCharts';
import TransactionTable from '@/components/TransactionTable';
import TransactionForm from '@/components/TransactionForm';
import { TransactionsHeader } from '@/components/transactions/TransactionsHeader';
import { useTransactionActions } from '@/components/transactions/TransactionActions';
import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionDialog';
import { TransactionDeleteConfirmation } from '@/components/transactions/TransactionDeleteConfirmation';
import { toast } from 'sonner';

type TransactionsTabProps = {
  transactions?: Transaction[];
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
  dateRange?: DateRange | null;
  setDateRange?: React.Dispatch<React.SetStateAction<DateRange | null>>;
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
  
  // Local state for when in consultor view mode
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const [localDateRange, setLocalDateRange] = useState<DateRange | null>(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { from: startOfMonth, to: endOfMonth };
  });
  
  // Determine which states to use based on props or local state
  const transactions = propTransactions || localTransactions;
  const setTransactions = propSetTransactions || setLocalTransactions;
  const dateRange = propDateRange || localDateRange;
  const setDateRange = propSetDateRange || setLocalDateRange;
  
  // Load client transactions if in consultor viewMode
  useEffect(() => {
    const loadClientTransactions = async () => {
      if (!clientId || viewMode !== 'consultor') return;
      
      try {
        const loadedTransactions = await fetchTransactionsByClientId(clientId);
        setLocalTransactions(loadedTransactions);
      } catch (error) {
        console.error('Error loading client transactions:', error);
        toast.error('Erro ao carregar transações do cliente');
      }
    };
    
    loadClientTransactions();
  }, [clientId, viewMode]);
  
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Open form to add a new transaction
  const handleAddNew = () => {
    // Block inactive users from adding transactions
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar transações.');
      return;
    }
    
    // Block consultors from adding transactions to client accounts
    if (viewMode === 'consultor') {
      toast.error('Você não tem permissão para adicionar transações para este cliente.');
      return;
    }
    
    console.log('Opening form to add new transaction');
    setEditingTransaction(null);
    setIsTransactionFormOpen(true);
  };
  
  // Close the transaction form
  const handleCloseForm = () => {
    console.log('Transaction form close requested');
    setIsTransactionFormOpen(false);
    
    // Clear the editing transaction after a short delay to avoid timing issues
    setTimeout(() => {
      console.log('Clearing editing transaction after form close');
      setEditingTransaction(null);
    }, 100);
  };
  
  // Edit a transaction
  const handleEdit = (transaction: Transaction) => {
    // Block inactive users from editing transactions
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode editar transações.');
      return;
    }
    
    // Block consultors from editing client transactions
    if (viewMode === 'consultor') {
      toast.error('Você não tem permissão para editar transações deste cliente.');
      return;
    }
    
    console.log('Editing transaction with data:', transaction);
    
    // Make sure we have a proper id in the transaction object
    const transactionCopy = {
      ...transaction,
      id: typeof transaction.id === 'number' ? transaction.id : undefined
    };
    
    console.log('Prepared transaction for edit:', transactionCopy);
    
    // First set the transaction, then open the form
    setEditingTransaction(transactionCopy);
    
    // Set form open after editing state is set with a small delay to ensure state updates
    setTimeout(() => {
      setIsTransactionFormOpen(true);
    }, 0);
  };
  
  // Use the transaction actions hook
  const { 
    deleteConfirmOpen, 
    setDeleteConfirmOpen,
    deleteSuccessOpen,
    setDeleteSuccessOpen,
    transactionToDelete,
    handleSubmitTransaction,
    handleDeleteRequest,
    confirmDelete,
    handleReloadAfterDelete
  } = useTransactionActions({ 
    setTransactions, 
    onCloseForm: handleCloseForm 
  });
  
  // Wrapper function for delete request that checks active status
  const handleDeleteWrapper = (id: number) => {
    // Block inactive users from deleting transactions
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode excluir transações.');
      return;
    }
    
    // Block consultors from deleting client transactions
    if (viewMode === 'consultor') {
      toast.error('Você não tem permissão para excluir transações deste cliente.');
      return;
    }
    
    handleDeleteRequest(id);
  };

  // Monitor form state for debugging
  useEffect(() => {
    console.log('Transaction form state changed - isOpen:', isTransactionFormOpen, 'editingTransaction:', editingTransaction?.id);
  }, [isTransactionFormOpen, editingTransaction]);

  return (
    <div className="space-y-6">
      <TransactionsHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onAddNew={handleAddNew}
        isUserActive={isUserActive()}
        viewMode={viewMode}
      />

      <SummaryCards 
        transactions={transactions}
        dateRange={dateRange}
      />
      
      <DashboardCharts
        transactions={transactions}
        dateRange={dateRange}
        clientId={clientId}
        viewMode={viewMode}
      />
      
      <div className="mt-8">
        <TransactionTable
          transactions={transactions}
          dateRange={dateRange}
          onEdit={handleEdit}
          onDelete={handleDeleteWrapper}
          isUserActive={isUserActive()}
          viewMode={viewMode}
        />
      </div>

      {user && (
        <TransactionForm
          isOpen={isTransactionFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTransaction}
          editingTransaction={editingTransaction}
          userId={viewMode === 'consultor' && clientId ? clientId : user.id}
        />
      )}
      
      <DeleteTransactionDialog
        open={deleteConfirmOpen} 
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        transactionId={transactionToDelete}
      />
      
      <TransactionDeleteConfirmation
        open={deleteSuccessOpen}
        onOpenChange={setDeleteSuccessOpen}
        onReload={handleReloadAfterDelete}
      />
    </div>
  );
};

export default TransactionsTab;
