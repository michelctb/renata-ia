
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = 'Painel de Administração' 
}) => {
  const { user, isAdmin, isConsultor } = useAuth();
  const navigate = useNavigate();

  // Verificar se o usuário está logado e tem permissões adequadas
  React.useEffect(() => {
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <DashboardHeader />
      
      <main className="flex-1 p-6 container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-sm animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{title}</h1>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex items-center gap-2 hover:shadow-md transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para Dashboard
          </Button>
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
