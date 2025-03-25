
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { fetchClienteById } from '@/lib/supabase/clients';

const DirectAccess = () => {
  const { userId } = useParams<{ userId: string }>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleDirectAccess = async () => {
      if (!userId) {
        toast.error('ID de usuário não encontrado na URL');
        navigate('/');
        return;
      }

      try {
        console.log('Login com ID:', userId);
        
        // Verificar se o cliente existe antes de fazer login
        const clienteData = await fetchClienteById(userId);
        
        if (!clienteData) {
          throw new Error('Cliente não encontrado');
        }
        
        // Efetuar login com o ID
        login(userId);
        
        // Aguardar um momento antes de redirecionar para garantir que o login seja processado
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
        
      } catch (error) {
        console.error('Erro no acesso direto:', error);
        toast.error('Não foi possível acessar com o ID fornecido');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      handleDirectAccess();
    }
  }, [userId, login, navigate, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-pulse text-xl mb-4">Autenticando...</div>
        <div className="text-sm text-gray-500">Redirecionando para o dashboard</div>
      </div>
    </div>
  );
};

export default DirectAccess;
