
import { useMemo } from 'react';
import { CreditCard, Users, CalendarClock } from 'lucide-react';
import { Cliente } from '@/lib/supabase/types';
import { formatCurrency } from '@/lib/utils';

interface RecurrencePreviewProps {
  clients: Cliente[];
}

export const RecurrencePreview = ({ clients }: RecurrencePreviewProps) => {
  const recurrenceData = useMemo(() => {
    // Filtrar apenas clientes ativos
    const activeClients = clients.filter(client => client.ativo === true);
    
    // Calcular valor total de recorrência
    const totalRecurrence = activeClients.reduce((sum, client) => {
      return sum + (client.valor || 0);
    }, 0);
    
    // Agrupar por planos
    const planCounts: Record<string, { count: number, value: number, totalValue: number }> = {};
    
    activeClients.forEach(client => {
      const plan = client.plano || 'Sem plano';
      const clientValue = client.valor || 0;
      
      if (!planCounts[plan]) {
        planCounts[plan] = { count: 0, value: clientValue, totalValue: 0 };
      }
      
      planCounts[plan].count += 1;
      // Para valor unitário, usamos o último valor encontrado para o plano
      planCounts[plan].value = clientValue;
      // Para valor total, somamos todos os valores dos clientes com esse plano
      planCounts[plan].totalValue += clientValue;
    });
    
    // Converter para array e ordenar por valor total
    const activePlans = Object.entries(planCounts)
      .map(([plan, data]) => ({
        plan,
        ...data
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
    
    return {
      totalRecurrence,
      activePlans
    };
  }, [clients]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="text-2xl font-bold text-income mb-4">
        {formatCurrency(recurrenceData.totalRecurrence)}
        <span className="text-xs font-normal text-muted-foreground ml-2">/ mês</span>
      </div>
      
      <div className="flex-grow overflow-auto space-y-3 my-2">
        <div className="text-sm font-medium">Detalhamento por plano:</div>
        
        {recurrenceData.activePlans.map((planData, index) => (
          <div key={index} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/20 p-2 rounded-md">
            <div className="flex items-center">
              <span className="font-medium">{planData.plan}</span>
              <span className="ml-2 text-muted-foreground">
                ({planData.count} {planData.count === 1 ? 'cliente' : 'clientes'})
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span>{formatCurrency(planData.totalValue)}</span>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(planData.value)} / cliente
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Total de recorrência</span>
          </div>
          <span className="text-xl font-semibold text-income">
            {formatCurrency(recurrenceData.totalRecurrence)}
          </span>
        </div>
      </div>
    </div>
  );
};
