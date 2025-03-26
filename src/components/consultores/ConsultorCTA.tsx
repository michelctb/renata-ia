
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ConsultorCTA = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Potencialize sua Consultoria Financeira
          </h2>
          <p className="max-w-[600px] text-white/80 md:text-xl/relaxed">
            Junte-se a centenas de consultores que já transformaram sua prática com a Renata.ia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/subscription">
                Comece agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" size="lg" asChild>
              <Link to="/login">
                Área do consultor
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultorCTA;
