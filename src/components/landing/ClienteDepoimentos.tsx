
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
            quote="Com a Renata.ia consegui organizar minhas finanças e finalmente começar a poupar para realizar meus sonhos."
            author="Beatriz Alexandre"
          />
          <ClienteTestimonialCard
            quote="A visualização clara dos meus gastos mudou completamente minha relação com o dinheiro. Agora sei exatamente onde economizar."
            author="Jéssica Oliveira"
          />
          <ClienteTestimonialCard
            quote="Nunca imaginei que seria tão fácil controlar meu orçamento. A Renata.ia simplificou todo o processo para mim."
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
