
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
    <div className="w-full h-full flex flex-col p-3">
      <div className="text-xl font-bold text-income mb-3">
        {formatCurrency(financialData.totalMonthlyRevenue)}
        <span className="text-xs font-normal text-muted-foreground ml-2">
          este mês ({financialData.currentMonth})
        </span>
      </div>
      
      <div className="flex-grow grid gap-2 my-2 overflow-hidden">
        <div className="flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-700/20 p-2 rounded-md">
          <div className="flex items-center">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="font-medium">Adesões do mês</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold">{formatCurrency(financialData.currentMonthAdesao)}</span>
            <span className="text-xs text-muted-foreground">
              {financialData.newClientsCount} novos clientes
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-700/20 p-2 rounded-md">
          <div className="flex items-center">
            <CalendarClock className="mr-1 h-4 w-4 text-blue-500" />
            <span className="font-medium">Recorrência mensal</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold">{formatCurrency(financialData.totalRecurrence)}</span>
            <span className="text-xs text-muted-foreground">
              {financialData.totalActiveClients} clientes ativos
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-700/20 p-2 rounded-md">
          <div className="flex items-center">
            <CreditCard className="mr-1 h-4 w-4 text-purple-500" />
            <span className="font-medium">Estimativa anual</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-income">
              {formatCurrency(financialData.totalRecurrence * 12 + financialData.currentMonthAdesao)}
            </span>
            <span className="text-xs text-muted-foreground">
              Projeção para 12 meses
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-1 pt-2 border-t">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>Total de clientes ativos</span>
          </div>
          <span className="text-base font-medium">
            {financialData.totalActiveClients}
          </span>
        </div>
      </div>
    </div>
  );
};
