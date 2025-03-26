
import { useMemo } from 'react';
import { Cliente } from '@/lib/supabase/types';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';

interface PlanConversionChartProps {
  clients: Cliente[];
}

// Definição das cores para os diferentes planos
const PLAN_COLORS = {
  teste: "#3b82f6",
  mensal: "#10b981",
  semestral: "#8b5cf6",
  anual: "#f59e0b",
  consultor: "#ec4899",
  default: "#94a3b8"
};

export const PlanConversionChart = ({ clients }: PlanConversionChartProps) => {
  const chartData = useMemo(() => {
    // Contagem de usuários por plano
    const planCounts: Record<string, number> = {};
    
    clients.forEach(client => {
      const plan = client.plano || 'Sem plano';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
    });
    
    // Converter para o formato esperado pelo gráfico
    return Object.entries(planCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Ordenar do maior para o menor
  }, [clients]);

  // Configuração das cores para o gráfico
  const planConfig = chartData.reduce((config, item) => {
    const planKey = item.name.toLowerCase().replace(/\s+/g, '');
    const color = PLAN_COLORS[planKey as keyof typeof PLAN_COLORS] || PLAN_COLORS.default;
    
    return {
      ...config,
      [planKey]: {
        label: item.name,
        theme: {
          light: color,
          dark: color
        }
      }
    };
  }, {});

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <ChartContainer className="h-full w-full" config={planConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => {
              const planKey = entry.name.toLowerCase().replace(/\s+/g, '');
              const color = PLAN_COLORS[planKey as keyof typeof PLAN_COLORS] || PLAN_COLORS.default;
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
