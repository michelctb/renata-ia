import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const scrollToSection = (sectionId: string) => {
    // Se estiver na página inicial, apenas rola para a seção
    if (location.pathname === '/landing' || location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Se estiver em outra página, navega para a página inicial com um hash
      navigate(`/landing#${sectionId}`);
    }
  };

  // Efeito para verificar o hash da URL quando a página carrega
  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2 font-bold mr-6">
          <img
            src="/lovable-uploads/14875af2-1f77-4e8e-af52-102a211d5723.png"
            alt="Renata.ia Logo"
            className="h-8 w-auto"
          />
          <span>Renata.ia</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('recursos')} 
            className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Recursos
          </button>
          <button 
            onClick={() => scrollToSection('como-funciona')} 
            className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Como funciona
          </button>
          <button 
            onClick={() => scrollToSection('sobre')} 
            className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Sobre nós
          </button>
          <Link to="/consultores" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
            Consultores
          </Link>
          <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
            Entrar
          </Link>
          <Button asChild size="sm">
            <Link to="/subscription">Assinar agora</Link>
          </Button>
        </nav>
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button size="sm" className="ml-2" asChild>
            <Link to="/subscription">Assinar</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
