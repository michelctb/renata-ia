
import React from 'react';
import { 
  BarChart3, 
  Smartphone, 
  Target,
  CreditCard, 
  BellRing, 
  MessageSquare 
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center space-y-2 rounded-lg border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
    <div className="rounded-full bg-primary/10 p-3">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-center text-slate-700 dark:text-slate-400">
      {description}
    </p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Dashboard interativo",
      description: "Visualize seus gastos e ganhos com gráficos dinâmicos e painéis personalizáveis."
    },
    {
      icon: Smartphone,
      title: "Controle via Whatsapp",
      description: "Registre transações por mensagem no WhatsApp sem precisar abrir o aplicativo."
    },
    {
      icon: Target,
      title: "Metas financeiras",
      description: "Defina e acompanhe metas de economia para concretizar seus sonhos."
    },
    {
      icon: CreditCard,
      title: "Categorização automática",
      description: "Seus gastos são automaticamente organizados por categorias para análise detalhada."
    },
    {
      icon: BellRing,
      title: "Lembretes de contas",
      description: "Nunca mais esqueça de pagar uma conta com nosso sistema de lembretes."
    },
    {
      icon: MessageSquare,
      title: "Consultor financeiro",
      description: "Obtenha orientação personalizada de um consultor financeiro especializado."
    }
  ];

  return (
    <section id="recursos" className="py-16 bg-white dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Recursos
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Tudo o que você precisa para o controle financeiro
            </h2>
            <p className="max-w-[900px] text-slate-700 dark:text-slate-400 md:text-xl/relaxed">
              Nossa plataforma oferece recursos avançados que simplificam o gerenciamento das suas finanças pessoais.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
