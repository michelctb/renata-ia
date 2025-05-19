
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
  highlightFilteredMonths?: boolean;
}

export function MonthlyTotalsChart({
  data,
  height = 300,
  showSaldo = true,
  highlightFilteredMonths = false
}: MonthlyTotalsChartProps) {
  const isMobile = useIsMobile();

  // Sempre calcular o maxValue e processedData, independente de termos dados ou não
  // Isso garante que o mesmo número de hooks seja usado em todas renderizações
  const maxValue = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return 1000;
    
    return Math.max(
      ...data.map(item => Math.max(item.entradas, item.saidas, Math.abs(item.saldo)))
    ) * 1.1; // 10% acima do máximo para melhor visualização
  }, [data]);

  // Preparar dados para visualização com opacidades diferentes
  // Esse hook agora é sempre executado, mesmo com dados vazios
  const processedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    if (!highlightFilteredMonths) return data;
    
    return data.map(item => ({
      ...item,
      // Definir a opacidade para as barras de acordo com o filtro
      entradas_fill: item.isInDateRange ? "#22c55e" : "#22c55e80", // Verde com 50% de opacidade se não estiver no filtro
      saidas_fill: item.isInDateRange ? "#ef4444" : "#ef444480"    // Vermelho com 50% de opacidade se não estiver no filtro
    }));
  }, [data, highlightFilteredMonths]);

  // Verificar se temos dados válidos
  if (!Array.isArray(data) || data.length === 0) {
    console.log("MonthlyTotalsChart: Nenhum dado para exibir");
    // Retorna um componente vazio com a mesma altura para manter o layout consistente
    return (
      <div style={{ height: `${height}px` }} className="w-full">
        <MonthlyTotalsEmpty />
      </div>
    );
  }
  
  console.log(`MonthlyTotalsChart: Renderizando com ${data.length} meses de dados`, data);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          fillOpacity={0.8}
          radius={[4, 4, 0, 0]} 
          barSize={isMobile ? 12 : 20}
          // Usar dataKey condicional para a cor se estivermos em modo de destaque
          {...(highlightFilteredMonths ? { fill: "entradas_fill" } : {})}
        />
        <Bar 
          name="Saídas" 
          dataKey="saidas" 
          fill="#ef4444" 
          radius={[4, 4, 0, 0]} 
          barSize={isMobile ? 12 : 20}
          fillOpacity={0.8}
          // Usar dataKey condicional para a cor se estivermos em modo de destaque
          {...(highlightFilteredMonths ? { fill: "saidas_fill" } : {})}
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
            strokeOpacity={highlightFilteredMonths ? 0.7 : 1}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
