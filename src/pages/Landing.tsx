
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  BarChart3, 
  BellRing, 
  Calendar, 
  CheckCircle, 
  CreditCard,
  MessageSquare, 
  Smartphone, 
  Target,
  User
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra de navegação */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Renata.ia
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#recursos" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#como-funciona" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
              Como funciona
            </a>
            <a href="#planos" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
              Planos
            </a>
            <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
              Entrar
            </Link>
            <Button asChild size="sm">
              <Link to="/subscription">Assinar agora</Link>
            </Button>
          </nav>
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="sm" className="ml-2" asChild>
              <Link to="/subscription">Assinar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 animate-fade-up">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Planejamento financeiro inteligente
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Controle suas finanças com inteligência artificial
                </h1>
                <p className="max-w-[600px] text-slate-700 dark:text-slate-400 md:text-xl">
                  Acompanhe suas transações, categorize gastos automaticamente e receba insights personalizados para melhorar sua saúde financeira.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild>
                    <Link to="/subscription">
                      Comece agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login">
                      Acessar minha conta
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none animate-fade-up overflow-hidden rounded-xl bg-white/20 p-2 shadow-xl backdrop-blur">
                <img
                  src="https://images.unsplash.com/photo-1579621970589-a3881c1448b5?q=80&w=2070&auto=format&fit=crop"
                  alt="Dashboard da aplicação"
                  className="w-full rounded-lg"
                  style={{ 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    aspectRatio: '16/9',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
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
              {/* Feature Card 1 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dashboard interativo</h3>
                <p className="text-center text-slate-700 dark:text-slate-400">
                  Visualize seus gastos e ganhos com gráficos dinâmicos e painéis personalizáveis.
                </p>
              </div>
              
              {/* Feature Card 2 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
                <div className="rounded-full bg-primary/10 p-3">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Controle via Whatsapp</h3>
                <p className="text-center text-slate-700 dark:text-slate-400">
                  Registre transações por mensagem no WhatsApp sem precisar abrir o aplicativo.
                </p>
              </div>
              
              {/* Feature Card 3 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
                <div className="rounded-full bg-primary/10 p-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Metas financeiras</h3>
                <p className="text-center text-slate-700 dark:text-slate-400">
                  Defina e acompanhe metas de economia para concretizar seus sonhos.
                </p>
              </div>
              
              {/* Feature Card 4 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
                <div className="rounded-full bg-primary/10 p-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Categorização automática</h3>
                <p className="text-center text-slate-700 dark:text-slate-400">
                  Seus gastos são automaticamente organizados por categorias para análise detalhada.
                </p>
              </div>
              
              {/* Feature Card 5 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
                <div className="rounded-full bg-primary/10 p-3">
                  <BellRing className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Lembretes de contas</h3>
                <p className="text-center text-slate-700 dark:text-slate-400">
                  Nunca mais esqueça de pagar uma conta com nosso sistema de lembretes.
                </p>
              </div>
              
              {/* Feature Card 6 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
                <div className="rounded-full bg-primary/10 p-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Consultor financeiro</h3>
                <p className="text-center text-slate-700 dark:text-slate-400">
                  Obtenha orientação personalizada de um consultor financeiro especializado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="como-funciona" className="py-16 bg-slate-50 dark:bg-slate-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Processo simples
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Como a Renata.ia funciona
                </h2>
                <p className="max-w-[900px] text-slate-700 dark:text-slate-400 md:text-xl/relaxed">
                  Em apenas três passos você começa a transformar sua vida financeira.
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Crie sua conta</h3>
                <p className="text-slate-700 dark:text-slate-400">
                  Assine um de nossos planos e crie seu perfil em menos de 5 minutos.
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Conecte seu WhatsApp</h3>
                <p className="text-slate-700 dark:text-slate-400">
                  Associe sua conta ao WhatsApp para registrar transações por mensagem.
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Gerencie suas finanças</h3>
                <p className="text-slate-700 dark:text-slate-400">
                  Comece a registrar transações e explore o dashboard para análises detalhadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
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
              {/* Plano Mensal */}
              <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Mensal</h3>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    Popular
                  </div>
                </div>
                <div className="mt-4 text-4xl font-bold">R$ 14,90<span className="text-base font-normal text-slate-500">/mês</span></div>
                <p className="mt-2 text-slate-700 dark:text-slate-400">Cobrança mensal recorrente</p>
                <ul className="mt-6 space-y-2.5">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Controle via WhatsApp</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Dashboard financeiro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Lembretes de contas</span>
                  </li>
                </ul>
                <Button className="mt-6" asChild>
                  <Link to="/subscription">Assinar agora</Link>
                </Button>
              </div>
              
              {/* Plano Anual */}
              <div className="flex flex-col rounded-lg border-2 border-primary bg-white p-6 shadow-lg dark:bg-slate-950">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Anual</h3>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    Economize 33%
                  </div>
                </div>
                <div className="mt-4 text-4xl font-bold">R$ 9,90<span className="text-base font-normal text-slate-500">/mês</span></div>
                <p className="mt-2 text-slate-700 dark:text-slate-400">Faturado anualmente</p>
                <ul className="mt-6 space-y-2.5">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Todos os recursos do plano mensal</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Economia de 33% no valor mensal</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="mt-6 bg-primary hover:bg-primary/90" asChild>
                  <Link to="/subscription">Assinar agora</Link>
                </Button>
              </div>
              
              {/* Plano Consultor */}
              <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Consultor</h3>
                </div>
                <div className="mt-4 text-4xl font-bold">Sob consulta</div>
                <p className="mt-2 text-slate-700 dark:text-slate-400">Para consultores financeiros</p>
                <ul className="mt-6 space-y-2.5">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Gerenciamento de clientes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Dashboard administrativo</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Suporte especializado</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-6" asChild>
                  <Link to="/subscription">Agende uma demonstração</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Pronto para transformar suas finanças?
              </h2>
              <p className="max-w-[600px] text-white/80 md:text-xl/relaxed">
                Comece hoje mesmo a controlar sua vida financeira com a Renata.ia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/subscription">
                    Comece grátis por 7 dias
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" size="lg" asChild>
                  <Link to="/login">
                    Já tenho uma conta
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container px-4 md:px-6 py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Renata.ia</h3>
              <p className="text-sm text-slate-700 dark:text-slate-400">
                Simplificando o controle financeiro com inteligência artificial.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Recursos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#recursos" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                    Dashboard interativo
                  </a>
                </li>
                <li>
                  <a href="#recursos" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                    Controle via WhatsApp
                  </a>
                </li>
                <li>
                  <a href="#recursos" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                    Metas financeiras
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                    Política de privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                    Termos de uso
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Contato</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contato@renata.ia" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                    contato@renata.ia
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-700 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                    +55 (11) 99999-9999
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
            <p className="text-center text-sm text-slate-700 dark:text-slate-400">
              © {new Date().getFullYear()} Renata.ia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
