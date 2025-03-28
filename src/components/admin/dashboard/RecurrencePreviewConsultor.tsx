
import { useMemo } from 'react';
import { CreditCard, Users, CalendarClock, TrendingUp } from 'lucide-react';
import { Cliente } from '@/lib/supabase/types';
import { formatCurrency } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

interface RecurrencePreviewConsultorProps {
  clients: Cliente[];
}

export const RecurrencePreviewConsultor = ({ clients }: RecurrencePreviewConsultorProps) => {
  const financialData = useMemo(() => {
    // Data atual para cálculos do mês corrente
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);
    
    // Filtrar apenas clientes ativos
    const activeClients = clients.filter(client => client.ativo === true);
    
    // Calcular valor total de recorrência mensal (apenas dos clientes ativos)
    const totalRecurrence = activeClients.reduce((sum, client) => {
      return sum + (client.recorrencia || 0);
    }, 0);
    
    // Calcular valor de adesão do mês corrente
    // (apenas clientes criados no mês atual)
    const currentMonthAdesao = clients.reduce((sum, client) => {
      if (!client.created_at) return sum;
      
      try {
        const createdDate = parseISO(client.created_at);
        
        // Verificar se o cliente foi criado no mês atual
        if (isWithinInterval(createdDate, {
          start: currentMonthStart,
          end: currentMonthEnd
        })) {
          return sum + (client.adesao || 0);
        }
      } catch (error) {
        console.error('Erro ao processar data de criação:', error);
      }
      
      return sum;
    }, 0);
    
    // Contar novos clientes do mês
    const newClientsCount = clients.reduce((count, client) => {
      if (!client.created_at) return count;
      
      try {
        const createdDate = parseISO(client.created_at);
        
        // Verificar se o cliente foi criado no mês atual
        if (isWithinInterval(createdDate, {
          start: currentMonthStart,
          end: currentMonthEnd
        })) {
          return count + 1;
        }
      } catch (error) {
        console.error('Erro ao processar data de criação:', error);
      }
      
      return count;
    }, 0);
    
    // Calcular o faturamento total do mês
    const totalMonthlyRevenue = currentMonthAdesao + totalRecurrence;
    
    return {
      totalRecurrence,
      currentMonthAdesao,
      totalMonthlyRevenue,
      newClientsCount,
      totalActiveClients: activeClients.length,
      currentMonth: format(today, 'MMMM yyyy')
    };
  }, [clients]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4">
      <div className="text-2xl font-bold text-income mb-4">
        {formatCurrency(financialData.totalMonthlyRevenue)}
        <span className="text-xs font-normal text-muted-foreground ml-2">
          este mês ({financialData.currentMonth})
        </span>
      </div>
      
      <div className="flex-grow space-y-4 my-2">
        <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/20 p-3 rounded-md">
          <div className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
            <span className="font-medium">Adesões do mês</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold">{formatCurrency(financialData.currentMonthAdesao)}</span>
            <span className="text-xs text-muted-foreground">
              {financialData.newClientsCount} novos clientes
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/20 p-3 rounded-md">
          <div className="flex items-center">
            <CalendarClock className="mr-2 h-5 w-5 text-blue-500" />
            <span className="font-medium">Recorrência mensal</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold">{formatCurrency(financialData.totalRecurrence)}</span>
            <span className="text-xs text-muted-foreground">
              {financialData.totalActiveClients} clientes ativos
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/20 p-3 rounded-md">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-purple-500" />
            <span className="font-medium">Estimativa anual</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-income">
              {formatCurrency(financialData.totalRecurrence * 12 + financialData.currentMonthAdesao)}
            </span>
            <span className="text-xs text-muted-foreground">
              Projeção para 12 meses
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Total de clientes ativos</span>
          </div>
          <span className="text-lg font-medium">
            {financialData.totalActiveClients}
          </span>
        </div>
      </div>
    </div>
  );
};
