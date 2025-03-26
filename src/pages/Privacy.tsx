
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
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
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">1. Introdução</h2>
            <p>
              A Renata.ia ("nós", "nosso" ou "nossa") está comprometida em proteger a privacidade e os dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações quando você utiliza nosso aplicativo e serviços.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">2. Informações que Coletamos</h2>
            <p>Podemos coletar os seguintes tipos de informações:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Informações de Conta:</strong> Nome, endereço de e-mail, número de telefone e informações de pagamento quando você se registra.
              </li>
              <li>
                <strong>Informações Financeiras:</strong> Transações, categorias de gastos, metas financeiras e outros dados relacionados à gestão financeira que você opta por registrar em nossa plataforma.
              </li>
              <li>
                <strong>Informações de Uso:</strong> Como você interage com nossos serviços, preferências e configurações.
              </li>
              <li>
                <strong>Informações do Dispositivo:</strong> Dados sobre o dispositivo que você usa para acessar nossos serviços, incluindo modelo, sistema operacional e navegador.
              </li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">3. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Fornecer, manter e melhorar nossos serviços;</li>
              <li>Processar transações e gerenciar sua conta;</li>
              <li>Personalizar sua experiência e fornecer insights financeiros relevantes;</li>
              <li>Enviar notificações, atualizações e comunicações relacionadas ao serviço;</li>
              <li>Analisar tendências de uso e melhorar a funcionalidade da plataforma;</li>
              <li>Detectar, prevenir e resolver problemas técnicos e de segurança.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">4. Compartilhamento de Informações</h2>
            <p>
              Não vendemos seus dados pessoais a terceiros. Podemos compartilhar suas informações nas seguintes circunstâncias:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Prestadores de Serviços:</strong> Com empresas que nos ajudam a operar e melhorar nossos serviços, como processadores de pagamento e serviços de análise.
              </li>
              <li>
                <strong>Conformidade Legal:</strong> Quando necessário para cumprir uma obrigação legal, regulamentação ou processo legal.
              </li>
              <li>
                <strong>Proteção de Direitos:</strong> Para proteger os direitos, a propriedade ou a segurança da Renata.ia, nossos usuários ou o público.
              </li>
              <li>
                <strong>Com seu Consentimento:</strong> Em outras circunstâncias com seu consentimento explícito.
              </li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">5. Segurança de Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações contra acesso não autorizado, perda ou alteração. No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">6. Seus Direitos</h2>
            <p>Dependendo da sua localização, você pode ter os seguintes direitos:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Acessar e receber uma cópia de seus dados pessoais;</li>
              <li>Retificar dados inexatos ou incompletos;</li>
              <li>Solicitar a exclusão de seus dados pessoais;</li>
              <li>Restringir ou opor-se ao processamento de seus dados;</li>
              <li>Transferir seus dados para outro serviço (portabilidade);</li>
              <li>Retirar seu consentimento a qualquer momento.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">7. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas publicando a nova política em nosso site ou aplicativo, ou enviando uma notificação direta.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Contato</h2>
            <p>
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco em:
            </p>
            <p className="mt-2">
              <strong>E-mail:</strong> contato@renata.ia<br />
              <strong>Telefone:</strong> (11) 99999-9999
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

export default Privacy;
