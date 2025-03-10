
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
  const { user } = useAuth();
  
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Open form to add a new transaction
  const handleAddNew = () => {
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
    console.log('Editing transaction:', transaction);
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };
  
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

  return (
    <>
      <TransactionsHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onAddNew={handleAddNew}
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
          onDelete={handleDeleteRequest}
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
    </>
  );
};

export default TransactionsTab;
