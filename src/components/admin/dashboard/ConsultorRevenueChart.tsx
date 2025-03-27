
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cliente } from '@/lib/clientes';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

interface ConsultorRevenueChartProps {
  clients: Cliente[];
}

export const ConsultorRevenueChart = ({ clients }: ConsultorRevenueChartProps) => {
  // Calcular dados do gráfico baseado nos clientes
  const chartData = useMemo(() => {
    // Se não houver clientes, retornar array vazio
    if (!clients || clients.length === 0) {
      return [];
    }

    // Encontrar a data mais antiga criação de cliente
    const oldestDate = clients.reduce((oldest, client) => {
      if (!client.created_at) return oldest;
      const createdDate = parseISO(client.created_at);
      return createdDate < oldest ? createdDate : oldest;
    }, new Date()); // Iniciar com data atual

    // Definir intervalo de datas (de 12 meses atrás até agora)
    const endDate = new Date();
    const startDate = subMonths(endDate, 11); // 12 meses incluindo o atual
    
    // Cria um array com todos os meses no intervalo
    const monthsInRange = eachMonthOfInterval({ start: startDate, end: endDate });
    
    // Mapear os meses para o formato de dados do gráfico
    return monthsInRange.map(monthDate => {
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      // Filtrar clientes criados neste mês (para adesões)
      const clientsCreatedThisMonth = clients.filter(client => {
        if (!client.created_at) return false;
        const createdDate = parseISO(client.created_at);
        return isWithinInterval(createdDate, {
          start: monthStart,
          end: monthEnd
        });
      });
      
      // Calcular total de adesões deste mês
      const adhesionRevenue = clientsCreatedThisMonth.reduce((sum, client) => {
        return sum + (client.adesao || 0);
      }, 0);
      
      // Calcular recorrências para este mês (todos clientes ativos criados até este mês)
      const clientsActiveUntilThisMonth = clients.filter(client => {
        if (!client.created_at || !client.ativo) return false;
        const createdDate = parseISO(client.created_at);
        return createdDate <= monthEnd;
      });
      
      const recurrenceRevenue = clientsActiveUntilThisMonth.reduce((sum, client) => {
        return sum + (client.recorrencia || 0);
      }, 0);
      
      // Retornar dados formatados para o mês
      return {
        name: format(monthDate, 'MMM', { locale: ptBR }),
        adesao: adhesionRevenue,
        recorrencia: recurrenceRevenue,
        total: adhesionRevenue + recurrenceRevenue
      };
    });
  }, [clients]);

  // Personalização do tooltip para mostrar valores formatados
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border text-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-red-500">{`Adesões: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-blue-500">{`Recorrências: ${formatCurrency(payload[1].value)}`}</p>
          <p className="font-medium">{`Total: ${formatCurrency(payload[2].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (!clients || clients.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        barGap={0}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis 
          tickFormatter={(value) => `${value.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}`} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="adesao" name="Adesões" fill="#ef4444" />
        <Bar dataKey="recorrencia" name="Recorrências" fill="#3b82f6" />
        <Bar dataKey="total" name="Total" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};
