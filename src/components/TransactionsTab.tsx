
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/lib/supabase';
import SummaryCards from '@/components/SummaryCards';
import DashboardCharts from '@/components/DashboardCharts';
import TransactionTable from '@/components/TransactionTable';
import TransactionForm from '@/components/TransactionForm';
import { TransactionsHeader } from '@/components/transactions/TransactionsHeader';
import { useTransactionActions } from '@/components/transactions/TransactionActions';
import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionDialog';
import { toast } from 'sonner';

type TransactionsTabProps = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  dateRange: DateRange | null;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | null>>;
};

const TransactionsTab = ({ 
  transactions, 
  setTransactions, 
  dateRange, 
  setDateRange 
}: TransactionsTabProps) => {
  const { user, isUserActive } = useAuth();
  
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Open form to add a new transaction
  const handleAddNew = () => {
    // Block inactive users from adding transactions
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar transações.');
      return;
    }
    
    console.log('Opening form to add new transaction');
    setEditingTransaction(null);
    setIsTransactionFormOpen(true);
  };
  
  // Close the transaction form
  const handleCloseForm = () => {
    console.log('Closing transaction form');
    setIsTransactionFormOpen(false);
    setEditingTransaction(null);
  };
  
  // Edit a transaction
  const handleEdit = (transaction: Transaction) => {
    // Block inactive users from editing transactions
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode editar transações.');
      return;
    }
    
    console.log('Editing transaction with data:', transaction);
    
    // Make sure we have a proper id in the transaction object
    const transactionCopy = {
      ...transaction,
      id: typeof transaction.id === 'number' ? transaction.id : undefined
    };
    
    console.log('Prepared transaction for edit:', transactionCopy);
    setEditingTransaction(transactionCopy);
    setIsTransactionFormOpen(true);
  };
  
  // Use the transaction actions hook
  const { 
    deleteConfirmOpen, 
    setDeleteConfirmOpen,
    handleSubmitTransaction,
    handleDeleteRequest,
    confirmDelete
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
    
    handleDeleteRequest(id);
  };

  return (
    <div className="space-y-6">
      <TransactionsHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onAddNew={handleAddNew}
        isUserActive={isUserActive()}
      />

      <SummaryCards 
        transactions={transactions}
        dateRange={dateRange}
      />
      
      <DashboardCharts
        transactions={transactions}
        dateRange={dateRange}
      />
      
      <div className="mt-8">
        <TransactionTable
          transactions={transactions}
          dateRange={dateRange}
          onEdit={handleEdit}
          onDelete={handleDeleteWrapper}
          isUserActive={isUserActive()}
        />
      </div>

      {user && (
        <TransactionForm
          isOpen={isTransactionFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTransaction}
          editingTransaction={editingTransaction}
          userId={user.id}
        />
      )}
      
      <DeleteTransactionDialog
        open={deleteConfirmOpen} 
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TransactionsTab;
