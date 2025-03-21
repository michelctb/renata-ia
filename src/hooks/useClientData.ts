
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Cliente, fetchClientes, fetchConsultorClients } from '@/lib/clientes';
import { toast } from 'sonner';

/**
 * Custom hook for fetching and managing client data based on user role.
 * Administrators see all clients, while consultants see only their own clients.
 * 
 * @returns {Object} Object containing clients data and loading state
 * @property {Cliente[]} clients - The list of clients accessible to the current user
 * @property {boolean} isLoading - Whether the clients are currently being loaded
 * @property {Function} loadClients - Function to manually reload the clients data
 */
export const useClientData = () => {
  const { user, isAdmin, isConsultor } = useAuth();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Loads clients based on the current user's role.
   * Administrators see all clients, consultants see only their assigned clients.
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

  // Carregar clientes quando o usuário estiver autenticado
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
