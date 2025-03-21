
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchClienteById } from '@/lib/clientes';
import TransactionsTab from '@/components/TransactionsTab';
import CategoriesTab from '@/components/CategoriesTab';
import DashboardCharts from '@/components/DashboardCharts';
import LembretesTab from '@/components/LembretesTab';
import { Cliente } from '@/lib/clientes';

const ConsultorClientView = () => {
  const { clientId } = useParams();
  const { user, isConsultor } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumo');
  const [clientData, setClientData] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está logado e tem permissões adequadas
    if (!user) {
      navigate('/');
      return;
    }

    if (!isConsultor()) {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
      return;
    }

    // Carregar os dados do cliente
    const loadClientData = async () => {
      if (!clientId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchClienteById(clientId);
        
        // Verificar se o cliente pertence ao consultor atual
        if (data.consultor !== user.id) {
          toast.error('Este cliente não está associado ao seu perfil');
          navigate('/admin');
          return;
        }
        
        setClientData(data);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        toast.error('Erro ao carregar dados do cliente');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [user, navigate, isConsultor, clientId]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <DashboardHeader />
      
      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-sm animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Dashboard do Cliente
            </h1>
            {clientData && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Visualizando dados de: <span className="font-medium">{clientData.nome || clientData.id_cliente}</span>
              </p>
            )}
          </div>
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
            className="flex items-center gap-2 hover:shadow-md transition-all dark:text-white dark:border-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para Administração
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Carregando dados do cliente...</span>
          </div>
        ) : clientData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
              <TabsTrigger value="resumo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Resumo</TabsTrigger>
              <TabsTrigger value="transacoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Transações</TabsTrigger>
              <TabsTrigger value="categorias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Categorias</TabsTrigger>
              <TabsTrigger value="lembretes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lembretes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resumo" className="space-y-4 animate-fade-up">
              <DashboardCharts clientId={clientId!} viewMode="consultor" />
            </TabsContent>
            
            <TabsContent value="transacoes" className="space-y-4 animate-fade-up">
              <TransactionsTab clientId={clientId!} viewMode="consultor" />
            </TabsContent>
            
            <TabsContent value="categorias" className="space-y-4 animate-fade-up">
              <CategoriesTab clientId={clientId!} viewMode="consultor" />
            </TabsContent>
            
            <TabsContent value="lembretes" className="space-y-4 animate-fade-up">
              <LembretesTab clientId={clientId!} viewMode="consultor" />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">Cliente não encontrado</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">O cliente solicitado não foi encontrado ou você não tem permissão para visualizá-lo.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConsultorClientView;
