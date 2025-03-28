
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserGrowthChart } from './dashboard/UserGrowthChart';
import { UserStatsSummary } from './dashboard/UserStatsSummary';
import { PlanConversionChart } from './dashboard/PlanConversionChart';
import { RetentionRateChart } from './dashboard/RetentionRateChart';
import { RecurrencePreview } from './dashboard/RecurrencePreview';
import { RecurrencePreviewConsultor } from './dashboard/RecurrencePreviewConsultor';
import { ConsultorRevenueChartCard } from './dashboard/ConsultorRevenueChartCard';
import { Cliente } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminDashboardProps {
  clients: Cliente[];
  isLoading: boolean;
}

const AdminDashboard = ({ clients, isLoading }: AdminDashboardProps) => {
  const [activeChart, setActiveChart] = useState('growth');
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

      {/* Grid responsivo para gráficos e previsão */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráficos detalhados - ajustados para ocupar espaço adequado */}
        <div className={`${viewMode === 'consultor' ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>
                {viewMode === 'admin' ? 'Análise de Usuários' : 'Análise de Clientes'}
              </CardTitle>
              <CardDescription>
                {viewMode === 'admin' 
                  ? 'Visualize o crescimento e conversão de usuários ao longo do tempo'
                  : 'Visualize o crescimento, retenção e faturamento dos clientes ao longo do tempo'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
                {viewMode === 'admin' ? (
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="growth">Crescimento</TabsTrigger>
                    <TabsTrigger value="conversion">Conversão de Planos</TabsTrigger>
                    <TabsTrigger value="retention">Retenção</TabsTrigger>
                  </TabsList>
                ) : (
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="growth">Crescimento</TabsTrigger>
                    <TabsTrigger value="retention">Retenção</TabsTrigger>
                    <TabsTrigger value="revenue">Faturamento</TabsTrigger>
                  </TabsList>
                )}
                
                <TabsContent value="growth" className="min-h-[350px] flex justify-center">
                  <UserGrowthChart clients={clients} />
                </TabsContent>
                
                {viewMode === 'admin' && (
                  <TabsContent value="conversion" className="min-h-[350px] flex justify-center">
                    <PlanConversionChart clients={clients} />
                  </TabsContent>
                )}
                
                <TabsContent value="retention" className="min-h-[350px] h-[350px] flex justify-center">
                  <RetentionRateChart clients={clients} />
                </TabsContent>

                {viewMode === 'consultor' && (
                  <TabsContent value="revenue" className="min-h-[350px] h-[350px] flex justify-center w-full">
                    <ConsultorRevenueChartCard clients={clients} />
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Os dados são atualizados em tempo real conforme novas informações são inseridas no sistema.
            </CardFooter>
          </Card>
        </div>
        
        {/* Card de previsão de recorrência melhorado */}
        <div className="h-full">
          {viewMode === 'admin' ? (
            <RecurrencePreview clients={clients} />
          ) : (
            <RecurrencePreviewConsultor clients={clients} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
