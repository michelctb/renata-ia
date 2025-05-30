
import { useMemo } from 'react';
import { Cliente } from '@/lib/supabase/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipProps } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RetentionRateChartProps {
  clients: Cliente[];
}

export const RetentionRateChart = ({ clients }: RetentionRateChartProps) => {
  const chartData = useMemo(() => {
    // Últimos 12 meses
    const today = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(today, 11 - i);
      return {
        month: format(date, 'MMM', { locale: ptBR }),
        fullMonth: format(date, 'MMMM', { locale: ptBR }),
        year: date.getFullYear(),
        date
      };
    });

    // Inicializar dados com zeros para todos os meses
    const data = months.map(month => ({
      name: `${month.month}/${month.year}`,
      fullName: `${month.fullMonth} de ${month.year}`,
      taxaRetencao: 0,
      usuariosAtivos: 0,
      totalUsuarios: 0
    }));

    // Para cada mês, calcular:
    // 1. Total de usuários no início do mês
    // 2. Usuários ativos no final do mês
    // 3. Taxa de retenção (ativos / total)
    
    months.forEach((month, index) => {
      const monthStart = startOfMonth(month.date);
      const monthEnd = endOfMonth(month.date);
      
      // Usuários existentes até o início do mês
      const existingUsers = clients.filter(client => {
        if (!client.created_at) return false;
        const creationDate = new Date(client.created_at);
        return creationDate <= monthStart;
      });
      
      // Usuários ativos no fim do mês
      const activeUsers = existingUsers.filter(client => {
        // Se não temos dados de atividade, consideramos como ativo
        if (client.ativo === undefined || client.ativo === null) return true;
        return client.ativo === true;
      });
      
      const totalCount = existingUsers.length;
      const activeCount = activeUsers.length;
      
      // Cálculo da taxa de retenção
      const retentionRate = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;
      
      data[index].taxaRetencao = parseFloat(retentionRate.toFixed(1));
      data[index].usuariosAtivos = activeCount;
      data[index].totalUsuarios = totalCount;
    });

    return data;
  }, [clients]);

  const retentionConfig = {
    taxaRetencao: {
      label: "Taxa de Retenção (%)",
      theme: {
        light: "#f59e0b",
        dark: "#fbbf24"
      }
    },
    usuariosAtivos: {
      label: "Usuários Ativos",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    },
    totalUsuarios: {
      label: "Total de Usuários",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    }
  };

  // Custom tooltip para melhorar a precisão das informações
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      // Encontrar dados completos para este ponto
      const dataPoint = chartData.find(item => item.name === label);
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border text-sm">
          <p className="font-medium">{dataPoint?.fullName || label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === "Taxa de Retenção (%)" 
                ? `${entry.value}%` 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer className="h-full w-full" config={retentionConfig}>
      <div className="w-full h-full flex justify-center items-center">
        <AreaChart
          width={700}
          height={320}
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
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            position={{ y: -70 }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="taxaRetencao" 
            stroke="var(--color-taxaRetencao)" 
            fill="var(--color-taxaRetencao)" 
            fillOpacity={0.3}
            name="Taxa de Retenção (%)"
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="usuariosAtivos" 
            stroke="var(--color-usuariosAtivos)" 
            fill="var(--color-usuariosAtivos)" 
            fillOpacity={0.3}
            name="Usuários Ativos"
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="totalUsuarios" 
            stroke="var(--color-totalUsuarios)" 
            fill="var(--color-totalUsuarios)" 
            fillOpacity={0.3}
            name="Total de Usuários"
            isAnimationActive={false}
          />
        </AreaChart>
      </div>
    </ChartContainer>
  );
};
