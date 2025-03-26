
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Renata.ia
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#recursos" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
            Recursos
          </a>
          <a href="#como-funciona" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
            Como funciona
          </a>
          <Link to="/subscription" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
            Planos
          </Link>
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
