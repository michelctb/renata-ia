
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const PlansTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Planos</CardTitle>
        <CardDescription>
          Configure os planos disponíveis para usuários e consultores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Planos para usuários */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl">Mensal</CardTitle>
              <CardDescription>Para usuários</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold mb-4">R$ 14,90<span className="text-sm font-normal">/mês</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">✓ Acesso completo</li>
                <li className="flex items-center">✓ Recomendado para iniciantes</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl">Semestral</CardTitle>
              <CardDescription>Para usuários</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold mb-4">R$ 12,90<span className="text-sm font-normal">/mês</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">✓ Acesso completo</li>
                <li className="flex items-center">✓ Economia de 13%</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl">Anual</CardTitle>
              <CardDescription>Para usuários</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold mb-4">R$ 9,90<span className="text-sm font-normal">/mês</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">✓ Acesso completo</li>
                <li className="flex items-center">✓ Economia de 33%</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlansTab;
