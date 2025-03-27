
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserGrowthChart } from './dashboard/UserGrowthChart';
import { UserStatsSummary } from './dashboard/UserStatsSummary';
import { PlanConversionChart } from './dashboard/PlanConversionChart';
import { RetentionRateChart } from './dashboard/RetentionRateChart';
import { RecurrencePreview } from './dashboard/RecurrencePreview';
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

      {/* Previsão de recorrência - só mostrar para administradores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${viewMode === 'admin' ? 'md:col-span-2' : 'md:col-span-3'}`}>
          {/* Gráficos detalhados */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Análise de Usuários</CardTitle>
              <CardDescription>Visualize o crescimento e conversão de usuários ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="growth">Crescimento</TabsTrigger>
                  <TabsTrigger value="conversion">Conversão de Planos</TabsTrigger>
                  <TabsTrigger value="retention">Retenção</TabsTrigger>
                </TabsList>
                
                <TabsContent value="growth" className="h-80">
                  <UserGrowthChart clients={clients} />
                </TabsContent>
                
                <TabsContent value="conversion" className="h-80">
                  <PlanConversionChart clients={clients} />
                </TabsContent>
                
                <TabsContent value="retention" className="h-80">
                  <RetentionRateChart clients={clients} />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Os dados são atualizados em tempo real conforme novas informações são inseridas no sistema.
            </CardFooter>
          </Card>
        </div>
        
        {viewMode === 'admin' && (
          <div>
            <RecurrencePreview clients={clients} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
