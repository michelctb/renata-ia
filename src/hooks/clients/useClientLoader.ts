
import { useState } from 'react';
import { fetchClientes, fetchConsultorClients, Cliente } from '@/lib/clientes';
import { toast } from 'sonner';
import { User } from '@/contexts/AuthContext';
import { ClientDataHookResult } from './types';

/**
 * Hook para carregar clientes com base na função do usuário
 */
export const useClientLoader = (
  user: User | null, 
  isAdmin: () => boolean, 
  isConsultor: () => boolean
): ClientDataHookResult => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carrega os clientes com base na função do usuário atual.
   * Administradores veem todos os clientes, consultores veem apenas seus clientes atribuídos.
   */
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

  return {
    clients,
    isLoading,
    loadClients
  };
};
