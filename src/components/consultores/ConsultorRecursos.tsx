
import React from 'react';
import { CheckCircle } from 'lucide-react';

const ConsultorRecursos = () => {
  return (
    <section className="py-16" id="recursos">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Recursos Exclusivos para Consultores
          </h2>
          <p className="mt-4 text-slate-700 dark:text-slate-400 mx-auto max-w-[700px]">
            Ferramentas poderosas para impulsionar sua consultoria financeira.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-1">Dashboard Multicliente</h3>
                <p className="text-slate-600">Gerencie todos os seus clientes a partir de uma única interface, com acesso rápido aos dados financeiros de cada um.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-1">Relatórios Personalizados</h3>
                <p className="text-slate-600">Crie relatórios detalhados para cada cliente, com foco nas métricas mais relevantes para seu perfil financeiro.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-1">Alertas Personalizados</h3>
                <p className="text-slate-600">Configure alertas para eventos importantes nas finanças dos seus clientes, como gastos excessivos ou oportunidades de investimento.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-1">Análise Comparativa</h3>
                <p className="text-slate-600">Compare o desempenho financeiro entre diferentes períodos ou entre clientes com perfis semelhantes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultorRecursos;
