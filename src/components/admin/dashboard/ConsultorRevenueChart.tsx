
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Cliente } from '@/lib/clientes';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isAfter, isSameMonth } from 'date-fns';
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

    // Definir intervalo de datas (de 12 meses atrás até o mês atual)
    const endDate = new Date();
    const startDate = subMonths(endDate, 11); // 12 meses incluindo o atual
    
    // Cria um array com todos os meses no intervalo
    const monthsInRange = eachMonthOfInterval({ start: startDate, end: endDate });
    
    // Mapear os meses para o formato de dados do gráfico
    return monthsInRange.map(monthDate => {
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      // Inicializar valores para o mês
      let adhesionRevenue = 0;
      let recurrenceRevenue = 0;
      
      // Para cada cliente
      clients.forEach(client => {
        if (!client.created_at) return;
        
        const createdDate = parseISO(client.created_at);
        
        // Verificar se o cliente foi criado neste mês ou antes
        if (isAfter(createdDate, monthEnd)) {
          // Cliente ainda não existia neste mês
          return;
        }
        
        // Se o cliente foi criado neste mês exato, adicionar a adesão
        if (isSameMonth(createdDate, monthDate)) {
          adhesionRevenue += Number(client.adesao) || 0;
        }
        
        // Se o cliente já existia neste mês, adicionar a recorrência
        // (ou seja, se foi criado neste mês ou antes)
        if (!isAfter(createdDate, monthEnd)) {
          recurrenceRevenue += Number(client.recorrencia) || 0;
        }
      });
      
      // Retornar dados formatados para o mês
      return {
        name: format(monthDate, 'MMM', { locale: ptBR }),
        month: format(monthDate, 'MM/yyyy'),
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
          <p className="font-medium">{`${label} (${payload[0]?.payload?.month})`}</p>
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
      <div className="flex justify-center items-center h-full w-full">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }

  // Verificar se temos dados para exibir depois dos cálculos
  const hasData = chartData.some(data => data.adesao > 0 || data.recorrencia > 0);
  
  if (!hasData) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p className="text-muted-foreground">Sem dados de faturamento para exibir</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <BarChart
        width={700}
        height={320}
        data={chartData}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        barGap={0}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name"
          tick={{ fontSize: 12 }}
          height={40}
        />
        <YAxis 
          tickFormatter={(value) => `${value.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}`}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 10 }} />
        <Bar dataKey="adesao" name="Adesões" fill="#ef4444" />
        <Bar dataKey="recorrencia" name="Recorrências" fill="#3b82f6" />
        <Bar dataKey="total" name="Total" fill="#10b981" />
      </BarChart>
    </div>
  );
};
