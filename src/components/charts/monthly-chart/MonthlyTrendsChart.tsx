
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { ChartErrorDisplay } from './ChartErrorDisplay';

interface TrendData {
  mes: number;
  ano: number;
  receitas: number;
  despesas: number;
  balanco: number;
}

interface MonthlyTrendsChartProps {
  data: TrendData[];
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

export function MonthlyTrendsChart({ data, isLoading, error, className = '' }: MonthlyTrendsChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      name: `${item.mes}/${item.ano}`,
      receitas: Number(item.receitas),
      despesas: Number(item.despesas),
      balanco: Number(item.balanco)
    })).reverse();
  }, [data]);

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12 mb-2 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ChartErrorDisplay error={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle>Tendências Financeiras</CardTitle>
          <CardDescription>Sem dados históricos suficientes</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Nenhum dado disponível para análise de tendências.</p>
            <p className="text-sm mt-2">Continue registrando suas transações para visualizar projeções futuras.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>Tendências Financeiras</CardTitle>
        <CardDescription>Projeção baseada no histórico recente</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value, 0)} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), '']} 
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => {
                const nameMap: Record<string, string> = {
                  receitas: 'Receitas',
                  despesas: 'Despesas',
                  balanco: 'Balanço'
                };
                return nameMap[value] || value;
              }}
            />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="balanco" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
