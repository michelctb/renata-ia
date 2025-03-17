
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { fetchClienteById } from '@/lib/clientes';

// Type for our user
export type User = {
  id: string;
  email?: string;
  name?: string;
  isActive?: boolean; // New field to track if user is active
};

// Context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  isUserActive: () => boolean; // New helper function
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('financialDashboardUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Retrieved user from localStorage:', parsedUser);
        
        // Fetch client's data from the database
        if (parsedUser && parsedUser.id) {
          fetchClienteById(parsedUser.id)
            .then(clienteData => {
              if (clienteData) {
                // Update user with name and active status from Clientes table
                const updatedUser = {
                  ...parsedUser,
                  name: clienteData.nome,
                  isActive: clienteData.ativo
                };
                setUser(updatedUser);
                // Update localStorage with the updated info
                localStorage.setItem('financialDashboardUser', JSON.stringify(updatedUser));
              } else {
                setUser(parsedUser);
              }
            })
            .catch(error => {
              console.error('Error fetching client data:', error);
              setUser(parsedUser);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          setUser(parsedUser);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('financialDashboardUser');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userId: string) => {
    // Use userId directly without appending WhatsApp suffix
    console.log('Logging in user with ID:', userId);
    
    // Fetch client data to get the name and active status
    fetchClienteById(userId)
      .then(clienteData => {
        if (!clienteData) {
          throw new Error('Cliente não encontrado');
        }
        
        // Create user object with client data
        const newUser = { 
          id: userId,
          name: clienteData?.nome,
          isActive: clienteData?.ativo 
        };
        
        setUser(newUser);
        localStorage.setItem('financialDashboardUser', JSON.stringify(newUser));
        
        // Show different toast messages based on active status
        if (clienteData?.ativo) {
          toast.success('Login realizado com sucesso');
        } else {
          toast.warning('Sua assinatura está inativa. Acesso somente para visualização.');
        }
      })
      .catch(error => {
        console.error('Error fetching client data during login:', error);
        toast.error('Erro ao fazer login: ' + (error.message || 'Tente novamente'));
      });
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('financialDashboardUser');
    toast.success('Logout realizado com sucesso');
  };
  
  // Helper function to check if user is active
  const isUserActive = () => {
    return user?.isActive === true;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isUserActive,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
