
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('financialDashboardUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userId: string) => {
    // Garantir que o ID do usuário tenha o sufixo correto
    const hasWhatsAppSuffix = userId.includes('@s.whatsapp.net');
    const correctUserId = hasWhatsAppSuffix ? userId : `${userId}@s.whatsapp.net`;
    
    console.log('Logging in user with formatted ID:', correctUserId);
    
    // Simple login with userId
    const newUser = { id: correctUserId };
    setUser(newUser);
    localStorage.setItem('financialDashboardUser', JSON.stringify(newUser));
    toast.success('Login realizado com sucesso');
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
