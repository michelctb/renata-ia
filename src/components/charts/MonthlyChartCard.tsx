
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
  onMonthClick?: (month: string) => void;
  selectedMonth?: string | null;
}

export function MonthlyChartCard({ 
  data, 
  transactions, 
  clientId,
  onMonthClick,
  selectedMonth
}: MonthlyChartCardProps) {
  // Se os dados forem fornecidos diretamente, use-os
  // Caso contrário, processe os dados de todas as transações
  const chartData = data || useMonthlyChartData(transactions || []);
  
  // Função de callback para clique com log de debug
  const handleMonthClick = (month: string) => {
    console.log('MonthlyChartCard - Mês clicado:', month);
    console.log('MonthlyChartCard - Callback disponível:', !!onMonthClick);
    if (onMonthClick) {
      onMonthClick(month);
    }
  };
  
  // Log para debug
  useEffect(() => {
    if (selectedMonth) {
      console.log('MonthlyChartCard - Mês selecionado:', selectedMonth);
    }
    console.log('MonthlyChartCard - Callback disponível:', !!onMonthClick);
  }, [selectedMonth, onMonthClick]);

  return (
    <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-3" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="pb-2">
        <CardTitle>Entradas e Saídas por Mês</CardTitle>
        <CardDescription>
          Visualização mensal de valores recebidos e pagos (todos os períodos)
          {selectedMonth && <span className="ml-1 text-blue-500 font-medium">• Filtro: {selectedMonth}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <MonthlyChart 
          data={chartData} 
          onMonthClick={onMonthClick ? handleMonthClick : undefined}
          selectedMonth={selectedMonth}
        />
      </CardContent>
    </Card>
  );
}
