
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const DashboardHeader = () => {
  const { user, logout, isAdmin, isConsultor } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user?.name) {
      return user.name.substring(0, 2).toUpperCase();
    }
    return user?.id.substring(0, 2).toUpperCase() || 'U';
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center">
        <div className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Renata.ia
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Mostrar botão de Admin apenas para adm e consultor */}
        {(isAdmin() || isConsultor()) && (
          <Button 
            variant="outline" 
            onClick={handleAdminClick}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            <span>Administração</span>
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-blue-100">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.name && (
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Nome: {user.name}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>ID: {user?.id}</span>
            </DropdownMenuItem>
            {user?.perfil && (
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                <span>Perfil: {
                  user.perfil === 'adm' ? 'Administrador' : 
                  user.perfil === 'consultor' ? 'Consultor' : 'Usuário'
                }</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
