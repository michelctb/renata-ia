
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

  const handleSubmitTransaction = async (transaction: Transaction) => {
    if (!user) return;
    
    try {
      if (transaction.id) {
        const updated = await updateTransaction(transaction);
        setTransactions(prev => 
          prev.map(t => (t.id === transaction.id ? updated : t))
        );
        toast.success('Transação atualizada com sucesso!');
      } else {
        const added = await addTransaction(transaction);
        setTransactions(prev => [...prev, added]);
        toast.success('Transação adicionada com sucesso!');
      }
    } catch (error) {
      console.error('Error with transaction:', error);
      toast.error('Erro ao salvar a transação. Tente novamente.');
    } finally {
      handleCloseForm();
    }
  };
  
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };
  
  const handleDeleteRequest = (id: number) => {
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    
    try {
      await deleteTransaction(transactionToDelete);
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete));
      toast.success('Transação excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao excluir a transação. Tente novamente.');
    } finally {
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
    }
  };
  
  const handleAddNew = () => {
    setEditingTransaction(null);
    setIsTransactionFormOpen(true);
  };
  
  const handleCloseForm = () => {
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
