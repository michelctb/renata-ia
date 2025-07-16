import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlyChartData } from '../hooks/useMonthlyChartData';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';

interface MonthlyBarChartProps {
  transactions: Transaction[];
  dateRange?: DateRange | null;
}

interface MonthlyData {
  month: string;
  entradas: number;
  saidas: number;
}

export function MonthlyBarChart({ transactions, dateRange }: MonthlyBarChartProps) {
  const monthlyData = useMonthlyChartData(transactions, dateRange);

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Formatador do eixo Y
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return `R$ ${value.toFixed(0)}`;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Entradas e Saídas por Mês
        </CardTitle>
        <CardDescription>
          Visualização mensal de valores recebidos e pagos (todos os períodos)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '14px' }}
                iconType="rect"
              />
              <Bar 
                dataKey="entradas" 
                name="Entradas"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="saidas" 
                name="Saídas"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Dados de todo período (clique em um mês para filtrar)
        </div>
      </CardContent>
    </Card>
  );
}