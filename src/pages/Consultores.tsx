
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { CheckCircle, ArrowRight, MessageSquare, Users, Wallet } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col p-6 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
    <p className="italic text-slate-700 mb-4">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
        {author.charAt(0)}
      </div>
      <div className="ml-3">
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-slate-600">{role}</p>
      </div>
    </div>
  </div>
);

const Consultores = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6">
                Transforme seu Consultório Financeiro com Renata.ia
              </h1>
              <p className="max-w-[700px] mx-auto text-slate-700 dark:text-slate-400 md:text-xl mb-8">
                Potencialize a gestão financeira dos seus clientes com uma plataforma inteligente que simplifica seu trabalho e aumenta seus resultados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/subscription">
                    Começar agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#beneficios">
                    Saiba mais
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
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
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Gestão Centralizada"
                description="Gerencie todos os seus clientes em um único lugar, com painéis personalizados para cada perfil."
              />
              <FeatureCard
                icon={<MessageSquare className="h-6 w-6" />}
                title="Comunicação Simplificada"
                description="Interaja com seus clientes através do WhatsApp, facilitando o registro e acompanhamento de transações."
              />
              <FeatureCard
                icon={<Wallet className="h-6 w-6" />}
                title="Rastreamento Financeiro"
                description="Acompanhe o progresso financeiro dos seus clientes em tempo real com relatórios detalhados."
              />
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-16 bg-slate-50 dark:bg-slate-800" id="como-funciona">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Como Funciona para Consultores
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-400 mx-auto max-w-[700px]">
                Um processo simples para transformar sua consultoria financeira.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Cadastre seus Clientes</h3>
                <p className="text-slate-700 dark:text-slate-400">
                  Crie perfis personalizados para cada cliente com metas financeiras específicas.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Monitore as Finanças</h3>
                <p className="text-slate-700 dark:text-slate-400">
                  Acompanhe transações, categorias de gastos e metas em um dashboard intuitivo.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Ofereça Consultoria</h3>
                <p className="text-slate-700 dark:text-slate-400">
                  Utilize os dados e insights para fornecer consultoria personalizada e eficaz.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
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
              <TestimonialCard
                quote="A Renata.ia revolucionou minha consultoria. Consigo acompanhar todos os meus clientes de forma muito mais eficiente."
                author="Carlos Silva"
                role="Consultor Financeiro"
              />
              <TestimonialCard
                quote="O dashboard personalizado para cada cliente facilita muito meu trabalho. Economizo horas de análise toda semana."
                author="Ana Oliveira"
                role="Planejadora Financeira"
              />
              <TestimonialCard
                quote="Meus clientes adoram a integração com WhatsApp. A facilidade de registro aumentou significativamente a adesão ao planejamento."
                author="Paulo Santos"
                role="Consultor de Investimentos"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
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

        {/* Recursos */}
        <section className="py-16">
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
      </main>
      <Footer />
    </div>
  );
};

export default Consultores;
