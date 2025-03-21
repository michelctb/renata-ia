
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
import { startOfMonth, endOfMonth } from 'date-fns';

const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Define o mês atual como período padrão
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  firstDayOfMonth.setHours(0, 0, 0, 0);
  
  const lastDayOfMonth = endOfMonth(today);
  lastDayOfMonth.setHours(23, 59, 59, 999);
  
  const [dateRange, setDateRange] = useState<DateRange | null>({
    from: firstDayOfMonth,
    to: lastDayOfMonth
  });
  
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
        
        const normalizedData = data.map(transaction => {
          let operationType = transaction.operação;
          
          if (operationType) {
            if (operationType.toLowerCase() === 'entrada' || operationType.toLowerCase() === 'saída') {
              operationType = operationType.toLowerCase();
            }
          }
          
          const dateStr = transaction.data;
          
          return {
            ...transaction,
            operação: operationType,
            data: dateStr
          };
        });
        
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse-slow text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <DashboardHeader />
      
      <div className="container px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <TabsList className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Transações</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Categorias</TabsTrigger>
            <TabsTrigger value="lembretes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lembretes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="animate-fade-up">
            <TransactionsTab 
              transactions={transactions}
              setTransactions={setTransactions}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </TabsContent>
          
          <TabsContent value="categories" className="animate-fade-up">
            <CategoriesTab />
          </TabsContent>
          
          <TabsContent value="lembretes" className="animate-fade-up">
            <LembretesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
