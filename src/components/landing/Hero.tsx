
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4 animate-fade-up">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Planejamento financeiro inteligente
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Controle suas finanças com inteligência artificial
            </h1>
            <p className="max-w-[600px] text-slate-700 dark:text-slate-400 md:text-xl">
              Acompanhe suas transações, categorize gastos automaticamente e receba insights personalizados para melhorar sua saúde financeira.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link to="/subscription">
                  Comece agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">
                  Acessar minha conta
                </Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[500px] lg:max-w-none animate-fade-up overflow-hidden rounded-xl bg-white/20 p-2 shadow-xl backdrop-blur">
            <img
              src="https://images.unsplash.com/photo-1579621970589-a3881c1448b5?q=80&w=2070&auto=format&fit=crop"
              alt="Dashboard da aplicação"
              className="w-full rounded-lg"
              style={{ 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                aspectRatio: '16/9',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
