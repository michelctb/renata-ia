import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { fetchTransactions, Transaction } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from '@/components/DashboardHeader';
import TransactionsTab from '@/components/TransactionsTab';
import CategoriesTab from '@/components/CategoriesTab';
import LembretesTab from '@/components/LembretesTab';
import { toast } from 'sonner';
import { parseISO } from 'date-fns';

const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        console.log(`Loaded ${data.length} transactions for user ${user.id}`);
        
        // Normalize transaction operation types for case-insensitivity and ensure dates are preserved
        const normalizedData = data.map(transaction => {
          let operationType = transaction.operação;
          
          // Normalize the operation type to lowercase
          if (operationType) {
            if (operationType.toLowerCase() === 'entrada' || operationType.toLowerCase() === 'saída') {
              operationType = operationType.toLowerCase();
            }
          }
          
          // Ensure date is in ISO format and doesn't lose the day due to timezone conversion
          const dateStr = transaction.data;
          
          return {
            ...transaction,
            operação: operationType,
            // Keep the original date string to avoid timezone issues
            data: dateStr
          };
        });
        
        // Verify all categories in transactions
        const categories = [...new Set(normalizedData.map(t => t.categoria))];
        console.log('Categories found in transactions:', categories);
        console.log('Operation types found:', [...new Set(normalizedData.map(t => t.operação))]);
        
        setTransactions(normalizedData);
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast.error('Erro ao carregar transações. Atualize a página.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, [user]);

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="lembretes">Lembretes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <TransactionsTab 
              transactions={transactions}
              setTransactions={setTransactions}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          
          <TabsContent value="lembretes">
            <LembretesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
