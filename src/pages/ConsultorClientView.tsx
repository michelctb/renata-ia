
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { fetchClientById } from '@/lib/supabase';
import { fetchTransactionsByClientId, Transaction } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsTab from '@/components/TransactionsTab';
import LembretesTab from '@/components/LembretesTab';
import CategoriesTab from '@/components/CategoriesTab';

export default function ConsultorClientView() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Define o mês atual como período padrão
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  firstDayOfMonth.setHours(0, 0, 0, 0);
  
  const lastDayOfMonth = endOfMonth(today);
  lastDayOfMonth.setHours(23, 59, 59, 999);
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: firstDayOfMonth,
    to: lastDayOfMonth
  });
  
  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthLoading && !user) {
        toast.error('Você precisa estar logado para acessar esta página');
        navigate('/');
        return;
      }
      
      if (!isAuthLoading && user && user.perfil !== 'consultor' && user.perfil !== 'adm') {
        toast.error('Você não tem permissão para acessar esta página');
        navigate('/dashboard');
        return;
      }
      
      if (!clientId) {
        toast.error('ID do cliente não fornecido');
        navigate('/dashboard');
        return;
      }
      
      await loadClientData();
    };
    
    checkAccess();
  }, [user, isAuthLoading, clientId]);
  
  const loadClientData = async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    try {
      // Buscar dados do cliente
      const clientData = await fetchClientById(clientId);
      setClient(clientData);
      
      // Buscar transações do cliente
      const transactionData = await fetchTransactionsByClientId(clientId);
      setTransactions(transactionData);
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
      toast.error('Erro ao carregar dados do cliente. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading || isAuthLoading) {
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
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Visualização de Cliente
            </h1>
            {client && (
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Cliente: {client.nome} {client.telefone && `(${client.telefone})`}
              </p>
            )}
          </div>
          
          <button
            onClick={() => navigate(-1)}
            className="mt-4 md:mt-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors text-gray-800 dark:text-gray-200"
          >
            Voltar
          </button>
        </div>
        
        <Tabs defaultValue="transactions" className="animate-fade-in">
          <TabsList className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Transações
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Categorias
            </TabsTrigger>
            <TabsTrigger value="lembretes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Lembretes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="animate-fade-up">
            <TransactionsTab 
              transactions={transactions}
              setTransactions={setTransactions}
              dateRange={dateRange}
              setDateRange={setDateRange}
              clientId={clientId}
              viewMode="consultor"
            />
          </TabsContent>
          
          <TabsContent value="categories" className="animate-fade-up">
            <CategoriesTab 
              clientId={clientId}
              viewMode="consultor"
            />
          </TabsContent>
          
          <TabsContent value="lembretes" className="animate-fade-up">
            <LembretesTab 
              clientId={clientId}
              viewMode="consultor"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
