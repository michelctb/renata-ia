
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
            quote="A Renata.ia revolucionou minha consultoria financeira. Antes, eu passava horas organizando planilhas e tentando visualizar os dados dos meus clientes. Agora, consigo acompanhar todos os meus clientes de forma muito mais eficiente, com dashboards personalizados e relatórios detalhados que me permitem identificar rapidamente áreas de melhoria. A automação me economiza pelo menos 10 horas por semana, tempo que agora dedico ao atendimento personalizado. Meus clientes notaram a diferença e minha retenção aumentou significativamente."
            author="Carlos Silva"
            role="Consultor Financeiro"
          />
          <ConsultorTestimonialCard
            quote="Como planejadora financeira, sempre enfrentei o desafio de manter meus clientes engajados com o planejamento. O dashboard personalizado da Renata.ia para cada cliente mudou completamente essa realidade. Economizo horas de análise toda semana e consigo focar no que realmente importa: estratégias personalizadas. A visualização clara dos dados facilita as conversas difíceis sobre cortes de gastos e meus clientes finalmente conseguem entender para onde vai o dinheiro deles. A ferramenta transformou minha prática profissional."
            author="Ana Oliveira"
            role="Planejadora Financeira"
          />
          <ConsultorTestimonialCard
            quote="A integração da Renata.ia com WhatsApp foi um divisor de águas para meu negócio de consultoria de investimentos. Meus clientes adoram a facilidade de registro de despesas e a forma como podem visualizar seus progressos. A adesão ao planejamento aumentou significativamente, o que antes era um grande desafio. As notificações automáticas de metas e limites de gastos reduziram drasticamente o número de clientes que abandonam o planejamento financeiro no meio do caminho. Como resultado, consegui triplicar minha base de clientes no último ano, com resultados muito mais consistentes."
            author="Paulo Santos"
            role="Consultor de Investimentos"
          />
        </div>
      </div>
    </section>
  );
};

export default ConsultorDepoimentos;
