
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/landing" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Renata.ia
            </Link>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/landing">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou usar os serviços da Renata.ia, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">2. Descrição do Serviço</h2>
            <p>
              A Renata.ia é uma plataforma de gestão financeira pessoal que oferece ferramentas para controle de gastos, análise financeira e orientação personalizada através de inteligência artificial.
            </p>
            <p className="mt-2">
              Nossos serviços incluem, mas não se limitam a:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Registro e categorização de transações financeiras;</li>
              <li>Análise de gastos e receitas;</li>
              <li>Definição e acompanhamento de metas financeiras;</li>
              <li>Interação via WhatsApp para registro de transações;</li>
              <li>Recomendações financeiras personalizadas;</li>
              <li>Lembretes de pagamentos e contas.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">3. Contas de Usuário</h2>
            <p>
              Para usar alguns de nossos serviços, você precisará criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta. Você concorda em:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Fornecer informações precisas e completas ao se registrar;</li>
              <li>Manter suas informações de conta atualizadas;</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta;</li>
              <li>Ser o único responsável por todas as atividades que ocorrem em sua conta.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">4. Planos e Pagamentos</h2>
            <p>
              Oferecemos diferentes planos de assinatura para acesso aos nossos serviços. Ao se inscrever em um plano pago, você concorda com os seguintes termos:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>As cobranças serão feitas de acordo com o ciclo de faturamento escolhido (mensal, semestral ou anual);</li>
              <li>As assinaturas serão renovadas automaticamente até que sejam canceladas;</li>
              <li>Você pode cancelar sua assinatura a qualquer momento, mas não haverá reembolsos por períodos parciais;</li>
              <li>Reservamo-nos o direito de modificar os preços mediante aviso prévio de 30 dias.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">5. Conteúdo do Usuário</h2>
            <p>
              Nossos serviços permitem que você armazene e compartilhe informações financeiras. Você mantém a propriedade de todo o conteúdo que você fornece, mas nos concede uma licença para usar esse conteúdo para fins de operação e melhoria dos serviços.
            </p>
            <p className="mt-2">
              Você é o único responsável pelo conteúdo que fornece e concorda em não fornecer conteúdo que:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Viole direitos de propriedade intelectual;</li>
              <li>Seja ilegal, difamatório, ameaçador ou abusivo;</li>
              <li>Contenha software malicioso ou código prejudicial;</li>
              <li>Interfira no funcionamento dos serviços.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">6. Propriedade Intelectual</h2>
            <p>
              Todos os direitos de propriedade intelectual relacionados aos nossos serviços, incluindo software, design, logotipos e conteúdo criado por nós, são de propriedade da Renata.ia ou de nossos licenciadores. Estes termos não concedem a você nenhum direito de usar nossas marcas registradas, logotipos, nomes de domínio ou outros recursos de marca.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">7. Limitação de Responsabilidade</h2>
            <p>
              Na extensão máxima permitida por lei, a Renata.ia não será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados ou uso, resultantes de ou relacionados ao uso de nossos serviços.
            </p>
            <p className="mt-2">
              Nossos serviços são fornecidos "como estão", sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que nossos serviços serão ininterruptos, oportunos, seguros ou livres de erros.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">8. Modificações dos Termos</h2>
            <p>
              Podemos modificar estes Termos de Uso periodicamente. Notificaremos você sobre alterações significativas publicando os novos termos em nosso site ou aplicativo, ou enviando uma notificação direta. O uso continuado dos serviços após tais modificações constitui sua aceitação dos novos termos.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">9. Rescisão</h2>
            <p>
              Podemos encerrar ou suspender sua conta e acesso aos serviços imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar estes Termos de Uso.
            </p>
            <p className="mt-2">
              Após o término, seu direito de usar os serviços cessará imediatamente. Se você deseja encerrar sua conta, você pode simplesmente descontinuar o uso de nossos serviços ou nos notificar.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Disposições Gerais</h2>
            <p>
              Estes Termos de Uso constituem o acordo completo entre você e a Renata.ia em relação ao uso de nossos serviços. A falha em exercer ou fazer valer qualquer direito ou disposição destes termos não constituirá uma renúncia a tal direito ou disposição.
            </p>
            <p className="mt-2">
              Se qualquer disposição destes termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.
            </p>
            <p className="mt-2">
              Estes termos são regidos pelas leis do Brasil. Quaisquer disputas relacionadas a estes termos ou aos serviços estarão sujeitas à jurisdição exclusiva dos tribunais da cidade de São Paulo, SP.
            </p>
          </section>
        </div>
      </main>
      
      {/* Rodapé */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container py-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Renata.ia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
