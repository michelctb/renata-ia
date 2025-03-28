
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserGrowthChart } from './dashboard/UserGrowthChart';
import { UserStatsSummary } from './dashboard/UserStatsSummary';
import { PlanConversionChart } from './dashboard/PlanConversionChart';
import { RetentionRateChart } from './dashboard/RetentionRateChart';
import { RecurrencePreview } from './dashboard/RecurrencePreview';
import { RecurrencePreviewConsultor } from './dashboard/RecurrencePreviewConsultor';
import { ConsultorRevenueChartCard } from './dashboard/ConsultorRevenueChartCard';
import { Cliente } from '@/lib/supabase/types';
import { Loader2, BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminDashboardProps {
  clients: Cliente[];
  isLoading: boolean;
}

const AdminDashboard = ({ clients, isLoading }: AdminDashboardProps) => {
  const { isAdmin, isConsultor } = useAuth();
  const viewMode = isAdmin() ? 'admin' : 'consultor';
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando estatísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas resumidas */}
      <UserStatsSummary clients={clients} viewMode={viewMode} />

      {/* Grid responsivo para gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Crescimento */}
        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">Crescimento de {viewMode === 'admin' ? 'Usuários' : 'Clientes'}</CardTitle>
              <CardDescription>Novos usuários e total acumulado por mês</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="min-h-[350px] h-[350px]">
            <UserGrowthChart clients={clients} />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            O gráfico mostra novos usuários por mês e o total acumulado.
          </CardFooter>
        </Card>

        {/* Gráfico de Retenção */}
        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">Retenção de {viewMode === 'admin' ? 'Usuários' : 'Clientes'}</CardTitle>
              <CardDescription>Taxa de retenção e usuários ativos</CardDescription>
            </div>
            <LineChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="min-h-[350px] h-[350px]">
            <RetentionRateChart clients={clients} />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            O gráfico mostra a taxa de retenção (%) e total de usuários ativos por mês.
          </CardFooter>
        </Card>

        {/* Gráficos específicos para cada tipo de usuário */}
        {viewMode === 'admin' ? (
          <>
            {/* Gráfico de Conversão de Planos (Admin) */}
            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl font-semibold">Conversão de Planos</CardTitle>
                  <CardDescription>Distribuição de usuários por plano</CardDescription>
                </div>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="min-h-[350px] h-[350px]">
                <PlanConversionChart clients={clients} />
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                O gráfico mostra a distribuição de usuários entre os diferentes planos.
              </CardFooter>
            </Card>
            
            {/* Card de Previsão de Recorrência (Admin) */}
            <RecurrencePreview clients={clients} />
          </>
        ) : (
          <>
            {/* Gráfico de Faturamento (Consultor) */}
            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl font-semibold">Faturamento Mensal</CardTitle>
                  <CardDescription>Evolução de adesões e recorrências</CardDescription>
                </div>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="min-h-[350px] h-[350px]">
                <ConsultorRevenueChartCard clients={clients} />
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                O gráfico mostra a evolução do faturamento mensal dividido em adesões e recorrências.
              </CardFooter>
            </Card>
            
            {/* Card de Previsão de Recorrência (Consultor) */}
            <RecurrencePreviewConsultor clients={clients} />
          </>
        )}
      </div>

      <div className="text-xs text-center text-muted-foreground mt-4">
        Os dados são atualizados em tempo real conforme novas informações são inseridas no sistema.
      </div>
    </div>
  );
};

export default AdminDashboard;
