
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DirectAccess = () => {
  const { userId } = useParams<{ userId: string }>();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      toast.error('ID de usuário não encontrado na URL');
      navigate('/');
      return;
    }

    try {
      // Use the userId directly without any modifications
      console.log('Login com ID:', userId);
      
      // Efetuar login com o ID
      login(userId);
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
      
      toast.success(`Acesso direto para o usuário: ${userId}`);
    } catch (error) {
      console.error('Erro no acesso direto:', error);
      toast.error('Não foi possível acessar com o ID fornecido');
      navigate('/');
    }
  }, [userId, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="animate-pulse text-lg">Autenticando...</div>
    </div>
  );
};

export default DirectAccess;
