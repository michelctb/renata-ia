
import React from 'react';
import ClienteTestimonialCard from './ClienteTestimonialCard';

const ClienteDepoimentos = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            O que Dizem os Clientes
          </h2>
          <p className="mt-4 text-slate-700 dark:text-slate-400 mx-auto max-w-[700px]">
            Descubra como a Renata.ia tem ajudado pessoas a transformarem suas finanças pessoais.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <ClienteTestimonialCard
            quote="A Renata.ia transformou minha relação com o dinheiro. Antes eu vivia no vermelho, sem conseguir planejar nada. Agora consigo visualizar todos os meus gastos, estabelecer metas claras e finalmente estou economizando. O que mais me impressionou é como a plataforma me alerta sobre gastos excessivos e me sugere onde posso economizar. Já recomendei para toda a minha família e amigos que também tinham dificuldades com as finanças."
            author="Beatriz Alexandre"
          />
          <ClienteTestimonialCard
            quote="Sempre fui desorganizada com minhas finanças e acabava gastando sem perceber. Com a Renata.ia, finalmente consegui visualizar para onde vai meu dinheiro a cada mês. A plataforma me ajudou a identificar padrões de consumo que eu nem percebia e agora consigo economizar até 30% da minha renda. O sistema de categorização automática e os alertas de orçamento são exatamente o que eu precisava para manter o controle. Estou muito satisfeita com os resultados!"
            author="Jéssica Oliveira"
          />
          <ClienteTestimonialCard
            quote="Durante anos tentei usar planilhas para controlar meus gastos, mas sempre acabava desistindo por falta de praticidade. A Renata.ia simplificou todo esse processo para mim. Consigo registrar despesas rapidamente, visualizar relatórios detalhados e acompanhar minhas metas de economia em tempo real. O recurso que mais gosto é poder fotografar recibos e notas fiscais que são automaticamente categorizados. É impressionante como a plataforma tornou o controle financeiro algo simples e até prazeroso!"
            author="Camila Alves"
          />
          <ClienteTestimonialCard
            quote="Ferramenta incrível, eu sou totalmente desorganizado nas finanças, fiquei maravilhado, consegui criar categorias de gasto e me organizar, ela também me avisa as datas em que tenho que pagar as despesas, o que pra mim, foi de grande ajuda porque sempre esquecia e me originava juros, meus parabéns ao criador da ferramenta, pra mim e tenho certeza que para muitos, será de grande ajuda."
            author="Fernando Gomes"
          />
        </div>
      </div>
    </section>
  );
};

export default ClienteDepoimentos;
