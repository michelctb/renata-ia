
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
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

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Renata.ia</h3>
            <p className="text-sm text-slate-700 dark:text-slate-400">
              Simplificando o controle financeiro com inteligência artificial.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('recursos')}
                  className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Dashboard interativo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('recursos')}
                  className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Controle via WhatsApp
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('recursos')}
                  className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Metas financeiras
                </button>
              </li>
              <li>
                <Link to="/consultores" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                  Para Consultores
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('sobre')}
                  className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Sobre nós
                </button>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                  Termos de uso
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contato</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contato@renata.ia" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                  contato@renata.ia
                </a>
              </li>
              <li>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                  +55 (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-sm text-slate-700 dark:text-slate-400">
            © {new Date().getFullYear()} Renata.ia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
