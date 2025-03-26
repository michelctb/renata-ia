
import React from 'react';
import { Info, Users, Building, Trophy } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="sobre" className="py-16 bg-slate-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Sobre a Renata.ia
          </h2>
          <p className="mt-4 text-slate-700 dark:text-slate-400 mx-auto max-w-[700px]">
            Conheça nossa história e missão de transformar a vida financeira das pessoas através da tecnologia.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Nossa História</h3>
            <p className="text-slate-600">
              Fundada em 2023, a Renata.ia nasceu da visão de simplificar o gerenciamento financeiro pessoal para todos os brasileiros através da inteligência artificial.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Nossa Missão</h3>
            <p className="text-slate-600">
              Democratizar o acesso à educação financeira e ferramentas inteligentes para que as pessoas tenham mais controle sobre suas finanças e possam realizar seus sonhos.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Nossa Equipe</h3>
            <p className="text-slate-600">
              Somos um time multidisciplinar composto por engenheiros, designers, especialistas em finanças e educadores apaixonados em criar soluções que impactam vidas.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Nossos Valores</h3>
            <p className="text-slate-600">
              Transparência, simplicidade, inovação e foco no cliente são os valores que guiam todas as nossas decisões e o desenvolvimento de nossos produtos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
