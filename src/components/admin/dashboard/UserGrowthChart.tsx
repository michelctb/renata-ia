
import { useMemo } from 'react';
import { Cliente } from '@/lib/supabase/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, subMonths, setMonth, getMonth, startOfMonth, endOfMonth, isBefore } from 'date-fns';
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

  const growthConfig = {
    novos: {
      label: "Novos Usuários",
      theme: {
        light: "#4f46e5",
        dark: "#818cf8"
      }
    },
    total: {
      label: "Total Acumulado",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    }
  };

  return (
    <ChartContainer className="h-full w-full" config={growthConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
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
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="novos" fill="var(--color-novos)" name="Novos Usuários" />
          <Bar dataKey="total" fill="var(--color-total)" name="Total Acumulado" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
