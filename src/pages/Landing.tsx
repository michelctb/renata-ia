
import React from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import ClienteDepoimentos from '@/components/landing/ClienteDepoimentos';
import AboutUs from '@/components/landing/AboutUs';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import { Helmet } from 'react-helmet';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Renata-ia | Assistente Financeira Inteligente</title>
        <meta name="description" content="Renata.ia - Plataforma inteligente para gestão financeira pessoal e consultoria financeira com ajuda de IA." />
        <meta name="keywords" content="consultoria financeira, gestão financeira, planejamento financeiro, assistente financeiro, finanças pessoais, IA financeira" />
      </Helmet>
      
      <Header />
      <main className="flex-1">
        <article>
          <Hero />
          <section id="recursos">
            <Features />
          </section>
          <section id="como-funciona">
            <HowItWorks />
          </section>
          <section id="depoimentos">
            <ClienteDepoimentos />
          </section>
          <section id="sobre-nos">
            <AboutUs />
          </section>
          <section id="comece-agora">
            <CTA />
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
