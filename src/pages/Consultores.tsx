
import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import ConsultorHero from '@/components/consultores/ConsultorHero';
import ConsultorBeneficios from '@/components/consultores/ConsultorBeneficios';
import ConsultorComoFunciona from '@/components/consultores/ConsultorComoFunciona';
import ConsultorDepoimentos from '@/components/consultores/ConsultorDepoimentos';
import ConsultorCTA from '@/components/consultores/ConsultorCTA';
import ConsultorRecursos from '@/components/consultores/ConsultorRecursos';

const Consultores = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ConsultorHero />
        <ConsultorBeneficios />
        <ConsultorComoFunciona />
        <ConsultorDepoimentos />
        <ConsultorCTA />
        <ConsultorRecursos />
      </main>
      <Footer />
    </div>
  );
};

export default Consultores;
