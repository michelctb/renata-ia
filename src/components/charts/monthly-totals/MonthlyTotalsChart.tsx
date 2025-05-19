
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { MonthlyTotalItem } from "@/hooks/reports/useMonthlyTotalsData";
import { MonthlyTotalsTooltip } from "./MonthlyTotalsTooltip";
import { MonthlyTotalsEmpty } from "./MonthlyTotalsEmpty";

interface MonthlyTotalsChartProps {
  data: MonthlyTotalItem[];
  height?: number;
  showSaldo?: boolean;
}

export function MonthlyTotalsChart({
  data,
  height = 300,
  showSaldo = true
}: MonthlyTotalsChartProps) {
  const isMobile = useIsMobile();

  // Calcular valor máximo para ajuste do domínio do gráfico
  const maxValue = useMemo(() => {
    if (!data?.length) return 1000;
    
    return Math.max(
      ...data.map(item => Math.max(item.entradas, item.saidas, Math.abs(item.saldo)))
    ) * 1.1; // 10% acima do máximo para melhor visualização
  }, [data]);

  // Não há dados para mostrar
  if (!data?.length) {
    return <MonthlyTotalsEmpty />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: "#e0e0e0" }}
          axisLine={{ stroke: "#e0e0e0" }}
          height={40}
          minTickGap={5}
        />
        <YAxis 
          width={isMobile ? 30 : 60}
          tickFormatter={(value) => `${(value / 1000)}k`}
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: "#e0e0e0" }}
          axisLine={{ stroke: "#e0e0e0" }}
          domain={[0, maxValue]}
        />
        <Tooltip content={<MonthlyTotalsTooltip />} />
        <Legend 
          verticalAlign="top" 
          height={36} 
          align="center"
        />
        <Bar 
          name="Entradas" 
          dataKey="entradas" 
          fill="#22c55e" 
          radius={[4, 4, 0, 0]} 
          barSize={isMobile ? 12 : 20} 
        />
        <Bar 
          name="Saídas" 
          dataKey="saidas" 
          fill="#ef4444" 
          radius={[4, 4, 0, 0]} 
          barSize={isMobile ? 12 : 20} 
        />
        {showSaldo && (
          <Line 
            name="Saldo" 
            type="monotone" 
            dataKey="saldo" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
