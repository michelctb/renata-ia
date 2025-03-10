
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  Transaction,
} from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import SummaryCards from '@/components/SummaryCards';
import DashboardCharts from '@/components/DashboardCharts';
import { DateRangePicker } from '@/components/DateRangePicker';
import TransactionTable from '@/components/TransactionTable';
import TransactionForm from '@/components/TransactionForm';

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

  // Handle adding or updating a transaction
  const handleSubmitTransaction = async (transaction: Transaction) => {
    if (!user) {
      toast.error('Você precisa estar logado para realizar esta operação.');
      return;
    }
    
    try {
      console.log('Processing transaction:', transaction);
      console.log('Processing transaction with user ID:', user.id);
      
      // Ensure cliente field is set correctly
      const transactionWithClient = {
        ...transaction,
        cliente: user.id
      };
      
      if (transaction.id) {
        // Update existing transaction
        console.log('Updating transaction with ID:', transaction.id);
        const updated = await updateTransaction(transactionWithClient);
        console.log('Updated transaction:', updated);
        
        if (updated) {
          setTransactions(prev => 
            prev.map(t => (t.id === transaction.id ? updated : t))
          );
          toast.success('Transação atualizada com sucesso!');
          handleCloseForm();
        }
      } else {
        // Add new transaction
        console.log('Adding new transaction');
        const added = await addTransaction(transactionWithClient);
        console.log('Added transaction:', added);
        
        if (added) {
          setTransactions(prev => [added, ...prev]);
          toast.success('Transação adicionada com sucesso!');
          handleCloseForm();
        }
      }
    } catch (error) {
      console.error('Error with transaction:', error);
      toast.error('Erro ao salvar a transação. Tente novamente.');
    }
  };
  
  // Edit a transaction
  const handleEdit = (transaction: Transaction) => {
    console.log('Editing transaction:', transaction);
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };
  
  // Request to delete a transaction
  const handleDeleteRequest = (id: number) => {
    console.log('Request to delete transaction ID:', id);
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Confirm deletion of a transaction
  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    
    try {
      console.log('Confirming deletion of transaction ID:', transactionToDelete);
      const success = await deleteTransaction(transactionToDelete);
      
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== transactionToDelete));
        toast.success('Transação excluída com sucesso!');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao excluir a transação. Tente novamente.');
    } finally {
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
    }
  };
  
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

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
          
          <Button 
            onClick={handleAddNew}
            className="whitespace-nowrap"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Nova Transação
          </Button>
        </div>
      </div>

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
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente esta transação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionsTab;
