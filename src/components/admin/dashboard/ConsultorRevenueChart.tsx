
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cliente } from '@/lib/clientes';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isAfter, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

interface ConsultorRevenueChartProps {
  clients: Cliente[];
  isMobile?: boolean;
}

export const ConsultorRevenueChart = ({ clients, isMobile = false }: ConsultorRevenueChartProps) => {
  // Calcular dados do gráfico baseado nos clientes
  const chartData = useMemo(() => {
    // Se não houver clientes, retornar array vazio
    if (!clients || clients.length === 0) {
      return [];
    }

    // Definir intervalo de datas (de 12 meses atrás até o mês atual)
    const endDate = new Date();
    // Para mobile, reduzimos para 6 meses para melhor visualização
    const startDate = subMonths(endDate, isMobile ? 5 : 11);
    
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
  }, [clients, isMobile]);

  // Personalização do tooltip para mostrar valores formatados
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = chartData.find(item => item.name === label);
      
      return (
        <div className="bg-white p-2 shadow-md rounded-md border text-xs">
          <p className="font-medium">{`${label} (${dataPoint?.month || ''})`}</p>
          <p className="text-red-500">{`Adesões: ${formatCurrency(payload[0]?.value || 0)}`}</p>
          <p className="text-blue-500">{`Recorrências: ${formatCurrency(payload[1]?.value || 0)}`}</p>
          <p className="font-medium">{`Total: ${formatCurrency(payload[2]?.value || 0)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (!clients || clients.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-muted-foreground">Sem dados para exibir</p>
      </div>
    );
  }

  // Verificar se temos dados para exibir depois dos cálculos
  const hasData = chartData.some(data => data.adesao > 0 || data.recorrencia > 0);
  
  if (!hasData) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-muted-foreground">Sem dados de faturamento para exibir</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
        <BarChart
          data={chartData}
          margin={isMobile ? 
            { top: 10, right: 5, left: 0, bottom: 20 } : 
            { top: 10, right: 10, left: 10, bottom: 20 }}
          barGap={0}
          barCategoryGap={isMobile ? "10%" : "20%"}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            height={40}
            interval={isMobile ? 1 : 0}
          />
          <YAxis 
            tickFormatter={(value) => isMobile ? 
              `${value / 1000}k` : 
              `R$ ${value.toLocaleString('pt-BR', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              })}`
            }
            width={isMobile ? 30 : 60}
            fontSize={isMobile ? 10 : 12}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend 
            verticalAlign="bottom"
            align="center"
            wrapperStyle={isMobile ? { fontSize: '10px' } : undefined}
          />
          <Bar dataKey="adesao" name="Adesões" fill="#ef4444" isAnimationActive={false} />
          <Bar dataKey="recorrencia" name="Recorrências" fill="#3b82f6" isAnimationActive={false} />
          <Bar dataKey="total" name="Total" fill="#10b981" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
