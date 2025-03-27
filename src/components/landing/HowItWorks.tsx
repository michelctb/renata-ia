import React from 'react';
const StepItem = ({
  number,
  title,
  description
}: {
  number: number;
  title: string;
  description: string;
}) => <div className="flex flex-col items-center space-y-2 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
      <span className="text-xl font-bold">{number}</span>
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-slate-700 dark:text-slate-400">
      {description}
    </p>
  </div>;
const HowItWorks = () => {
  const steps = [{
    number: 1,
    title: "Crie sua conta",
    description: "Assine um de nossos planos e crie seu perfil em menos de 5 minutos."
  }, {
    number: 2,
    title: "Conecte seu WhatsApp",
    description: "Associe sua conta ao WhatsApp para registrar transações por mensagem."
  }, {
    number: 3,
    title: "Gerencie suas finanças",
    description: "Comece a registrar transações e explore o dashboard para análises detalhadas."
  }];
  return <section id="como-funciona" className="py-16 bg-slate-50 dark:bg-slate-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Como a Renata.ia funciona
            </h2>
            <p className="max-w-[900px] text-slate-700 dark:text-slate-400 md:text-xl/relaxed">
              Em apenas três passos você começa a transformar sua vida financeira.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
          {steps.map((step, index) => <StepItem key={index} number={step.number} title={step.title} description={step.description} />)}
        </div>
      </div>
    </section>;
};
export default HowItWorks;