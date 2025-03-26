
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface PlanProps {
  title: string;
  badge?: string;
  price: React.ReactNode;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  highlighted?: boolean;
}

const PlanCard = ({ 
  title, 
  badge, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonVariant = "default",
  highlighted = false 
}: PlanProps) => (
  <div className={`flex flex-col rounded-lg ${highlighted ? 'border-2 border-primary bg-white' : 'border border-slate-200 bg-white'} p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${highlighted ? 'shadow-lg' : ''}`}>
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold">{title}</h3>
      {badge && (
        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
          {badge}
        </div>
      )}
    </div>
    <div className="mt-4 text-4xl font-bold">{price}</div>
    <p className="mt-2 text-slate-700 dark:text-slate-400">{description}</p>
    <ul className="mt-6 space-y-2.5">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <CheckCircle className="mr-2 h-4 w-4 text-primary" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button 
      className={`mt-6 ${highlighted ? 'bg-primary hover:bg-primary/90' : ''}`} 
      variant={buttonVariant} 
      asChild
    >
      <Link to="/subscription">{buttonText}</Link>
    </Button>
  </div>
);

const Pricing = () => {
  const plans = [
    {
      title: "Mensal",
      badge: "Popular",
      price: <>R$ 14,90<span className="text-base font-normal text-slate-500">/mês</span></>,
      description: "Cobrança mensal recorrente",
      features: [
        "Controle via WhatsApp",
        "Dashboard financeiro",
        "Lembretes de contas"
      ],
      buttonText: "Assinar agora",
      buttonVariant: "default" as const
    },
    {
      title: "Anual",
      badge: "Economize 33%",
      price: <>R$ 9,90<span className="text-base font-normal text-slate-500">/mês</span></>,
      description: "Faturado anualmente",
      features: [
        "Todos os recursos do plano mensal",
        "Economia de 33% no valor mensal",
        "Suporte prioritário"
      ],
      buttonText: "Assinar agora",
      buttonVariant: "default" as const,
      highlighted: true
    },
    {
      title: "Consultor",
      price: "Sob consulta",
      description: "Para consultores financeiros",
      features: [
        "Gerenciamento de clientes",
        "Dashboard administrativo",
        "Suporte especializado"
      ],
      buttonText: "Agende uma demonstração",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <section id="planos" className="py-16 bg-white dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Preços
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Planos para todos os perfis
            </h2>
            <p className="max-w-[900px] text-slate-700 dark:text-slate-400 md:text-xl/relaxed">
              Escolha o plano ideal para suas necessidades financeiras.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 mt-12">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
