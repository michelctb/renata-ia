
import React from 'react';

const ConsultorComoFunciona = () => {
  return (
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
  );
};

export default ConsultorComoFunciona;
