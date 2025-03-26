
import React from 'react';
import ConsultorTestimonialCard from './ConsultorTestimonialCard';

const ConsultorDepoimentos = () => {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            O que Dizem os Consultores
          </h2>
          <p className="mt-4 text-slate-700 dark:text-slate-400 mx-auto max-w-[700px]">
            Veja como outros consultores financeiros transformaram seu negócio com a Renata.ia.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ConsultorTestimonialCard
            quote="A Renata.ia revolucionou minha consultoria. Consigo acompanhar todos os meus clientes de forma muito mais eficiente."
            author="Carlos Silva"
            role="Consultor Financeiro"
          />
          <ConsultorTestimonialCard
            quote="O dashboard personalizado para cada cliente facilita muito meu trabalho. Economizo horas de análise toda semana."
            author="Ana Oliveira"
            role="Planejadora Financeira"
          />
          <ConsultorTestimonialCard
            quote="Meus clientes adoram a integração com WhatsApp. A facilidade de registro aumentou significativamente a adesão ao planejamento."
            author="Paulo Santos"
            role="Consultor de Investimentos"
          />
        </div>
      </div>
    </section>
  );
};

export default ConsultorDepoimentos;
