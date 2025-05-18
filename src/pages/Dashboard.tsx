
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
import { MetasTab } from '@/components/metas/MetasTab';
import { DateFilterButtons } from '@/components/DateFilterButtons';
import { toast } from 'sonner';
import { startOfMonth, endOfMonth } from 'date-fns';

interface DashboardProps {
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
}

const Dashboard = ({ clientId, viewMode = 'user' }: DashboardProps) => {
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleAddNew = () => {
    setIsFormOpen(true);
  };
  
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/');
    }
  }, [user, isAuthLoading, navigate]);
  
  useEffect(() => {
    const loadTransactions = async () => {
      // For consultant view, client ID should be provided
      const userId = (viewMode === 'consultor' && clientId) ? clientId : user?.id;
      
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchTransactions(userId);
        console.log(`Loaded ${data.length} transactions for ${viewMode === 'consultor' ? 'client' : 'user'} ${userId}`);
        
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
  }, [user, clientId, viewMode]);

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
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
            <TabsList className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
              <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Transações</TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Categorias</TabsTrigger>
              <TabsTrigger value="metas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Metas</TabsTrigger>
              <TabsTrigger value="lembretes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lembretes</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <DateFilterButtons
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onAddNew={activeTab === "transactions" ? handleAddNew : undefined}
            isUserActive={!!user}
            viewMode={viewMode}
          />
        </div>
          
        <div className="animate-fade-in">
          <Tabs value={activeTab}>
            <TabsContent value="transactions" className="animate-fade-up">
              <TransactionsTab 
                transactions={transactions}
                setTransactions={setTransactions}
                dateRange={dateRange}
                setDateRange={setDateRange}
                clientId={clientId}
                viewMode={viewMode}
                isFormOpen={isFormOpen}
                setIsFormOpen={setIsFormOpen}
              />
            </TabsContent>
            
            <TabsContent value="categories" className="animate-fade-up">
              <CategoriesTab clientId={clientId} viewMode={viewMode} />
            </TabsContent>
            
            <TabsContent value="metas" className="animate-fade-up">
              <MetasTab userId={viewMode === 'consultor' && clientId ? clientId : user?.id} />
            </TabsContent>
            
            <TabsContent value="lembretes" className="animate-fade-up">
              <LembretesTab clientId={clientId} viewMode={viewMode} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
