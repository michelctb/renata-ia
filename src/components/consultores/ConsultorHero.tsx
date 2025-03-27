
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ConsultorHero = () => {
  return <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6">Transforme sua Consultoria Financeira com Renata.ia</h1>
          <p className="max-w-[700px] mx-auto text-slate-700 dark:text-slate-400 md:text-xl mb-8">
            Potencialize a gestão financeira dos seus clientes com uma plataforma inteligente que simplifica seu trabalho e aumenta seus resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/subscription">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};

export default ConsultorHero;
