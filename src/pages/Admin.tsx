
import React, { useState, useEffect } from 'react';
import { useClientData } from '@/hooks/useClientData';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import AdminTabs from '@/components/admin/tabs/AdminTabs';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { clients, isLoading, loadClients } = useClientData();

  useEffect(() => {
    // Iniciar no dashboard
    setActiveTab('dashboard');
  }, []);

  return (
    <AdminLayout title="Painel de Administração">
      <AdminTabs 
        clients={clients}
        isLoading={isLoading}
        loadClients={loadClients}
        defaultTab={activeTab}
      />
    </AdminLayout>
  );
};

export default Admin;
