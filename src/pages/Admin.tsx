
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
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      
      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel de Administração</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Voltar para Dashboard
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>
          
          {/* Conteúdo da tab de Usuários */}
          <TabsContent value="usuarios" className="space-y-4">
            <UsersTab 
              clients={clients} 
              isLoading={isLoading} 
              loadClients={loadClients} 
            />
          </TabsContent>
          
          {/* Conteúdo da tab de Planos */}
          <TabsContent value="planos" className="space-y-4">
            <PlansTab />
          </TabsContent>
          
          {/* Conteúdo da tab de Relatórios */}
          <TabsContent value="relatorios" className="space-y-4">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
