
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
      // Extrair os primeiros 13 dígitos (número de telefone) do ID do usuário
      // E adicionar o sufixo padrão do WhatsApp
      const phoneNumberPart = userId.substring(0, 13);
      const fullUserId = `${phoneNumberPart}@s.whatsapp.net`;
      
      console.log('Login com ID completo:', fullUserId); // Debug log
      
      // Efetuar login com o ID completo
      login(fullUserId);
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
      
      toast.success(`Acesso direto para o usuário: ${phoneNumberPart}`);
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
