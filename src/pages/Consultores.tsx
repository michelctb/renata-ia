
import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import ConsultorHero from '@/components/consultores/ConsultorHero';
import ConsultorBeneficios from '@/components/consultores/ConsultorBeneficios';
import ConsultorComoFunciona from '@/components/consultores/ConsultorComoFunciona';
import ConsultorDepoimentos from '@/components/consultores/ConsultorDepoimentos';
import ConsultorCTA from '@/components/consultores/ConsultorCTA';
import ConsultorRecursos from '@/components/consultores/ConsultorRecursos';
import { Helmet } from 'react-helmet';

const Consultores = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Consultoria Financeira Inteligente | Renata-ia</title>
        <meta name="description" content="Transforme sua consultoria financeira com a Renata.ia. Simplifique seu trabalho, aumente a satisfação dos clientes e potencialize seus resultados." />
        <meta name="keywords" content="consultoria financeira, consultores financeiros, planejadores financeiros, gestão de clientes, dashboard financeiro, automatização financeira" />
      </Helmet>
      
      <Header />
      <main className="flex-1">
        <article>
          <ConsultorHero />
          <section id="beneficios">
            <ConsultorBeneficios />
          </section>
          <section id="como-funciona">
            <ConsultorComoFunciona />
          </section>
          <section id="depoimentos">
            <ConsultorDepoimentos />
          </section>
          <section id="cta">
            <ConsultorCTA />
          </section>
          <section id="recursos">
            <ConsultorRecursos />
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Consultores;
