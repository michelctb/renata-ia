
import { useMemo } from 'react';
import { Cliente } from '@/lib/supabase/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserGrowthChartProps {
  clients: Cliente[];
}

export const UserGrowthChart = ({ clients }: UserGrowthChartProps) => {
  const chartData = useMemo(() => {
    // Últimos 12 meses
    const today = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(today, 11 - i);
      return {
        month: format(date, 'MMM', { locale: ptBR }),
        fullMonth: format(date, 'MMMM', { locale: ptBR }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        date
      };
    });

    // Inicializar dados com zeros para todos os meses
    const data = months.map(month => ({
      name: `${month.month}/${month.year}`,
      fullName: `${month.fullMonth} de ${month.year}`,
      novos: 0,
      total: 0
    }));

    // Ordenar clientes por data de criação
    const sortedClients = [...clients].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });

    // Calcular novos usuários por mês e total acumulado
    let runningTotal = 0;
    
    sortedClients.forEach(client => {
      if (!client.created_at) return;
      
      const creationDate = new Date(client.created_at);
      
      // Verificar se a data está dentro dos últimos 12 meses
      if (isBefore(creationDate, startOfMonth(months[0].date))) {
        // Usuário criado antes do período de 12 meses, adicionar ao total inicial
        runningTotal++;
        return;
      }
      
      // Encontrar o mês correspondente
      const monthIndex = months.findIndex(m => 
        creationDate >= startOfMonth(m.date) && 
        creationDate <= endOfMonth(m.date)
      );
      
      if (monthIndex >= 0) {
        data[monthIndex].novos += 1;
      }
    });
    
    // Calcular o total acumulado mês a mês
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        data[i].total = runningTotal + data[i].novos;
      } else {
        data[i].total = data[i-1].total + data[i].novos;
      }
    }

    return data;
  }, [clients]);

  // Função personalizada para formatar o tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border text-sm">
          <p className="font-medium">{payload[0]?.payload?.fullName || label}</p>
          <p className="text-indigo-600">{`Novos Usuários: ${payload[0]?.value}`}</p>
          <p className="text-emerald-600">{`Total Acumulado: ${payload[1]?.value}`}</p>
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

  return (
    <div className="w-full h-full flex justify-center items-center">
      <BarChart
        width={700}
        height={320}
        data={chartData}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={70}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} position={{x: 0, y: 0}} cursor={{fill: 'rgba(0, 0, 0, 0.05)'}} />
        <Legend wrapperStyle={{ paddingTop: 10 }} />
        <Bar 
          dataKey="novos" 
          fill="#4f46e5" 
          name="Novos Usuários"
          isAnimationActive={false}
        />
        <Bar 
          dataKey="total" 
          fill="#10b981" 
          name="Total Acumulado"
          isAnimationActive={false}
        />
      </BarChart>
    </div>
  );
};
