
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyChart } from './MonthlyChart';
import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { useMonthlyChartData } from './hooks/useChartData';

interface MonthlyChartCardProps {
  data?: Array<{
    name: string;
    entrada: number;
    saída: number;
  }>;
  transactions?: Transaction[];
  clientId?: string;
}

export function MonthlyChartCard({ data, transactions, clientId }: MonthlyChartCardProps) {
  // Se os dados forem fornecidos diretamente, use-os
  // Caso contrário, processe os dados de todas as transações
  const chartData = data || useMonthlyChartData(transactions || []);

  return (
    <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-3" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="pb-2">
        <CardTitle>Entradas e Saídas por Mês</CardTitle>
        <CardDescription>Visualização mensal de valores recebidos e pagos (todos os períodos)</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <MonthlyChart data={chartData} />
      </CardContent>
    </Card>
  );
}
