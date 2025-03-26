
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast.error('Por favor, insira um ID de usuário');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the user ID directly without any modifications
      login(userId.trim());
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md animate-fade-up">
        <Card className="w-full shadow-lg border-none glassmorphism">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Renata.ia Dashboard</CardTitle>
            <CardDescription className="text-center">
              Entre com seu ID de usuário para acessar seus dados financeiros
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="userId"
                  placeholder="Digite seu ID de usuário"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="h-12"
                  autoComplete="off"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
              
              <div className="w-full flex items-center justify-center">
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
                  onClick={() => navigate('/subscription')}
                  type="button"
                >
                  Assine Já
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
