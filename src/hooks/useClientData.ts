
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Cliente, fetchClientes, fetchConsultorClients } from '@/lib/clientes';
import { toast } from 'sonner';

export const useClientData = () => {
  const { user, isAdmin, isConsultor } = useAuth();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      let loadedClients: Cliente[] = [];
      
      if (isAdmin()) {
        // Administradores veem todos os clientes
        loadedClients = await fetchClientes();
      } else if (isConsultor() && user?.id) {
        // Consultores veem apenas seus clientes
        loadedClients = await fetchConsultorClients(user.id);
      }
      
      setClients(loadedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Erro ao carregar lista de clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  return {
    clients,
    isLoading,
    loadClients
  };
};
