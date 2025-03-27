
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClientLoader } from './useClientLoader';
import { ClientDataHookResult } from './types';

/**
 * Custom hook para buscar e gerenciar dados de clientes com base na função do usuário.
 * Administradores veem todos os clientes, enquanto consultores veem apenas seus próprios clientes.
 * 
 * @returns {ClientDataHookResult} Objeto contendo dados de clientes e estado de carregamento
 * @property {Cliente[]} clients - A lista de clientes acessíveis ao usuário atual
 * @property {boolean} isLoading - Se os clientes estão sendo carregados no momento
 * @property {Function} loadClients - Função para recarregar manualmente os dados dos clientes
 */
export const useClientData = (): ClientDataHookResult => {
  const { user, isAdmin, isConsultor } = useAuth();
  const { clients, isLoading, loadClients } = useClientLoader(user, isAdmin, isConsultor);

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
