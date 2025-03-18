
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import UsersTab from '@/components/admin/UsersTab';
import PlansTab from '@/components/admin/PlansTab';
import ReportsTab from '@/components/admin/ReportsTab';
import { useClientData } from '@/hooks/useClientData';
import { ChevronLeft } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, isConsultor } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('usuarios');
  const { clients, isLoading, loadClients } = useClientData();

  useEffect(() => {
    // Verificar se o usuário está logado e tem permissões adequadas
    if (!user) {
      navigate('/');
      return;
    }

    if (!isAdmin() && !isConsultor()) {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
    }
  }, [user, navigate, isAdmin, isConsultor]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <DashboardHeader />
      
      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-sm animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Painel de Administração</h1>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex items-center gap-2 hover:shadow-md transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para Dashboard
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Usuários</TabsTrigger>
            <TabsTrigger value="planos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Planos</TabsTrigger>
            <TabsTrigger value="relatorios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Relatórios</TabsTrigger>
          </TabsList>
          
          {/* Conteúdo da tab de Usuários */}
          <TabsContent value="usuarios" className="space-y-4 animate-fade-up">
            <UsersTab 
              clients={clients} 
              isLoading={isLoading} 
              loadClients={loadClients} 
            />
          </TabsContent>
          
          {/* Conteúdo da tab de Planos */}
          <TabsContent value="planos" className="space-y-4 animate-fade-up">
            <PlansTab />
          </TabsContent>
          
          {/* Conteúdo da tab de Relatórios */}
          <TabsContent value="relatorios" className="space-y-4 animate-fade-up">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
