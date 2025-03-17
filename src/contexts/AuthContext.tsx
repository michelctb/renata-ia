
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { fetchClienteById } from '@/lib/clientes';

// Type for our user
export type User = {
  id: string;
  email?: string;
  name?: string;
};

// Context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (userId: string) => void;
  logout: () => void;
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
        
        // Fetch client's name from the database
        if (parsedUser && parsedUser.id) {
          fetchClienteById(parsedUser.id)
            .then(clienteData => {
              if (clienteData) {
                // Update user with name from Clientes table
                const updatedUser = {
                  ...parsedUser,
                  name: clienteData.nome
                };
                setUser(updatedUser);
                // Update localStorage with the name info
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
    
    // Fetch client data to get the name
    fetchClienteById(userId)
      .then(clienteData => {
        // Create user object with client name if available
        const newUser = { 
          id: userId,
          name: clienteData?.nome 
        };
        
        setUser(newUser);
        localStorage.setItem('financialDashboardUser', JSON.stringify(newUser));
        toast.success('Login realizado com sucesso');
      })
      .catch(error => {
        console.error('Error fetching client data during login:', error);
        // If error, still login but without the name
        const newUser = { id: userId };
        setUser(newUser);
        localStorage.setItem('financialDashboardUser', JSON.stringify(newUser));
        toast.success('Login realizado com sucesso');
      });
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('financialDashboardUser');
    toast.success('Logout realizado com sucesso');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
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
