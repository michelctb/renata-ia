
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from '@/components/DashboardHeader';
import SummaryCards from '@/components/SummaryCards';
import DashboardCharts from '@/components/DashboardCharts';
import { DateRangePicker } from '@/components/DateRangePicker';
import TransactionTable from '@/components/TransactionTable';
import TransactionForm from '@/components/TransactionForm';
import CategoriesTab from '@/components/CategoriesTab';

const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [activeTab, setActiveTab] = useState("transactions");
  
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/');
    }
  }, [user, isAuthLoading, navigate]);
  
  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await fetchTransactions(user.id);
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast.error('Erro ao carregar as transações. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, [user]);
  
  const handleSubmitTransaction = async (transaction: Transaction) => {
    if (!user) return;
    
    try {
      if (transaction.id) {
        const updated = await updateTransaction(transaction);
        setTransactions(prev => 
          prev.map(t => (t.id === transaction.id ? updated : t))
        );
      } else {
        const added = await addTransaction(transaction);
        setTransactions(prev => [...prev, added]);
      }
    } catch (error) {
      console.error('Error with transaction:', error);
      throw error;
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

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      
      <div className="container px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {activeTab === "transactions" && (
              <>
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
              </>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
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
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
        </Tabs>
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
    </div>
  );
};

export default Dashboard;
