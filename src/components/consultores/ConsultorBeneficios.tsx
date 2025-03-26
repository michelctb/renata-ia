
import React from 'react';
import ConsultorFeatureCard from './ConsultorFeatureCard';
import { MessageSquare, Users, Wallet } from 'lucide-react';

const ConsultorBeneficios = () => {
  return (
    <section className="py-16" id="beneficios">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Benefícios para Consultores
          </h2>
          <p className="mt-4 text-slate-700 dark:text-slate-400 mx-auto max-w-[700px]">
            Descubra como a Renata.ia pode transformar sua prática de consultoria financeira.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ConsultorFeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Gestão Centralizada"
            description="Gerencie todos os seus clientes em um único lugar, com painéis personalizados para cada perfil."
          />
          <ConsultorFeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Comunicação Simplificada"
            description="Interaja com seus clientes através do WhatsApp, facilitando o registro e acompanhamento de transações."
          />
          <ConsultorFeatureCard
            icon={<Wallet className="h-6 w-6" />}
            title="Rastreamento Financeiro"
            description="Acompanhe o progresso financeiro dos seus clientes em tempo real com relatórios detalhados."
          />
        </div>
      </div>
    </section>
  );
};

export default ConsultorBeneficios;
