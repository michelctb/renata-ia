
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyChart } from './MonthlyChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { Transaction } from '@/lib/supabase/types';
import { ChartFilterToggle } from './ChartFilterToggle';
import { ChartErrorDisplay } from './ChartErrorDisplay';
import { useMonthlyChartCardData } from '../hooks/useMonthlyChartCardData';

interface MonthlyChartCardProps {
  data?: Array<{
    name: string;
    entrada: number;
    saída: number;
  }>;
  transactions?: Transaction[];
  filteredTransactions?: Transaction[];
  clientId?: string;
  onMonthClick?: (month: string) => void;
  selectedMonth?: string | null;
  dateFilterDescription?: string;
}

export function MonthlyChartCard({ 
  data, 
  transactions = [], 
  filteredTransactions = [], 
  clientId,
  onMonthClick,
  selectedMonth,
  dateFilterDescription
}: MonthlyChartCardProps) {
  const isMobile = useIsMobile();
  
  // Estado para controlar se o gráfico deve respeitar o filtro de data
  const [respectDateFilter, setRespectDateFilter] = useState<boolean>(false);
  
  // Log para debug dos dados recebidos
  console.log("MonthlyChartCard - dados recebidos:", {
    hasDirectData: Array.isArray(data) && data.length > 0,
    hasTransactions: Array.isArray(transactions) && transactions.length > 0,
    transactionsCount: Array.isArray(transactions) ? transactions.length : 0,
    hasFilteredTransactions: Array.isArray(filteredTransactions) && filteredTransactions.length > 0,
    filteredTransactionsCount: Array.isArray(filteredTransactions) ? filteredTransactions.length : 0,
    respectingFilter: respectDateFilter
  });
  
  // Uso do hook para processamento de dados
  const {
    chartData,
    hasError,
    errorMessage,
  } = useMonthlyChartCardData({
    data,
    transactions: transactions || [],
    filteredTransactions: filteredTransactions || [],
    respectDateFilter
  });
  
  // Função de callback para clique com log de debug
  const handleMonthClick = (month: string) => {
    console.log('MonthlyChartCard - Mês clicado:', month);
    if (onMonthClick) {
      onMonthClick(month);
    }
  };

  return (
    <Card className="border shadow-sm col-span-1 lg:col-span-3">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Entradas e Saídas por Mês</CardTitle>
          
          <ChartFilterToggle 
            respectDateFilter={respectDateFilter}
            onToggleChange={setRespectDateFilter}
          />
        </div>
        
        <CardDescription>
          {respectDateFilter ? 
            `Visualização de valores por mês (período filtrado${dateFilterDescription ? `: ${dateFilterDescription}` : ''})` : 
            'Visualização mensal de valores recebidos e pagos (todos os períodos)'}
          {selectedMonth && <span className="ml-1 text-blue-500 font-medium">• Filtro: {selectedMonth}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] pb-2">
        {hasError ? (
          <ChartErrorDisplay errorMessage={errorMessage} />
        ) : (
          <MonthlyChart 
            data={chartData || []} 
            onMonthClick={onMonthClick ? handleMonthClick : undefined}
            selectedMonth={selectedMonth}
            isEmpty={!Array.isArray(chartData) || chartData.length === 0}
            mode={respectDateFilter ? 'filtered' : 'all'}
          />
        )}
      </CardContent>
    </Card>
  );
}
