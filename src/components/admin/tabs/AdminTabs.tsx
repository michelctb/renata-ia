
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UsersTab from '@/components/admin/UsersTab';
import ReportsTab from '@/components/admin/ReportsTab';
import { Cliente } from '@/lib/clientes';

interface AdminTabsProps {
  clients: Cliente[];
  isLoading: boolean;
  loadClients: () => Promise<void>;
  defaultTab?: string;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  clients,
  isLoading,
  loadClients,
  defaultTab = 'dashboard'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
      <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
        <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Usuários
        </TabsTrigger>
        <TabsTrigger value="relatorios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Relatórios
        </TabsTrigger>
      </TabsList>
      
      {/* Conteúdo da tab de Dashboard */}
      <TabsContent value="dashboard" className="space-y-4 animate-fade-up">
        <AdminDashboard clients={clients} isLoading={isLoading} />
      </TabsContent>
      
      {/* Conteúdo da tab de Usuários */}
      <TabsContent value="usuarios" className="space-y-4 animate-fade-up">
        <UsersTab 
          clients={clients} 
          isLoading={isLoading} 
          loadClients={loadClients} 
        />
      </TabsContent>
      
      {/* Conteúdo da tab de Relatórios */}
      <TabsContent value="relatorios" className="space-y-4 animate-fade-up">
        <ReportsTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
