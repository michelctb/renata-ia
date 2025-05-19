
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { MonthlyDataItem } from '@/hooks/reports/types';

interface MonthlyComparisonChartProps {
  currentData: MonthlyDataItem[];
  previousData?: MonthlyDataItem[];
  isLoading?: boolean;
  className?: string;
}

export function MonthlyComparisonChart({ 
  currentData, 
  previousData, 
  isLoading,
  className = ''
}: MonthlyComparisonChartProps) {
  const chartData = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];
    
    // Se não tiver dados de comparação, apenas formatar os dados atuais
    if (!previousData || previousData.length === 0) {
      return currentData.map(item => ({
        name: item.month,
        atual: item.balance,
        atualReceitas: item.receitas,
        atualDespesas: item.despesas
      }));
    }
    
    // Combinar dados atuais com dados anteriores
    return currentData.map(current => {
      // Tentar encontrar o mês correspondente no período anterior
      const previous = previousData.find(p => p.month === current.month);
      
      return {
        name: current.month,
        atual: current.balance,
        anterior: previous?.balance || 0,
        atualReceitas: current.receitas,
        anteriorReceitas: previous?.receitas || 0,
        atualDespesas: current.despesas,
        anteriorDespesas: previous?.despesas || 0
      };
    });
  }, [currentData, previousData]);

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>Comparação Mensal</CardTitle>
        <CardDescription>
          {previousData && previousData.length > 0 
            ? "Comparando com período anterior" 
            : "Visualização do período atual"}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value, 0)} />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), '']}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend />
            
            {previousData && previousData.length > 0 ? (
              <>
                <Bar name="Período Atual" dataKey="atual" fill="#3b82f6" />
                <Bar name="Período Anterior" dataKey="anterior" fill="#9ca3af" />
              </>
            ) : (
              <>
                <Bar name="Receitas" dataKey="atualReceitas" fill="#10b981" />
                <Bar name="Despesas" dataKey="atualDespesas" fill="#ef4444" />
                <Bar name="Saldo" dataKey="atual" fill="#3b82f6" />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
