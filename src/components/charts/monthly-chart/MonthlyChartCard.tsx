
import { useState, useMemo } from 'react';
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
  dateFilterDescription?: string;
}

export function MonthlyChartCard({ 
  data, 
  transactions = [], 
  filteredTransactions = [], 
  clientId,
  dateFilterDescription
}: MonthlyChartCardProps) {
  const isMobile = useIsMobile();
  
  // Estado para controlar se o gráfico deve respeitar o filtro de data
  const [respectDateFilter, setRespectDateFilter] = useState<boolean>(false);
  
  // Garantir arrays seguros antes de passar para o hook
  const safeData = useMemo(() => Array.isArray(data) ? data : undefined, [data]);
  const safeTransactions = useMemo(() => Array.isArray(transactions) ? transactions : [], [transactions]);
  const safeFilteredTransactions = useMemo(() => Array.isArray(filteredTransactions) ? filteredTransactions : [], [filteredTransactions]);
  
  // Log para debug dos dados recebidos
  console.log("MonthlyChartCard - dados recebidos:", {
    hasDirectData: Array.isArray(safeData) && safeData?.length > 0,
    hasTransactions: safeTransactions.length > 0,
    transactionsCount: safeTransactions.length,
    hasFilteredTransactions: safeFilteredTransactions.length > 0,
    filteredTransactionsCount: safeFilteredTransactions.length,
    respectingFilter: respectDateFilter
  });
  
  // Uso do hook para processamento de dados com verificações de tipo
  const {
    chartData,
    hasError,
    errorMessage,
  } = useMonthlyChartCardData({
    data: safeData,
    transactions: safeTransactions,
    filteredTransactions: safeFilteredTransactions,
    respectDateFilter
  });

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
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] pb-2">
        {hasError ? (
          <ChartErrorDisplay errorMessage={errorMessage} />
        ) : (
          <MonthlyChart 
            data={chartData}
            isEmpty={!Array.isArray(chartData) || chartData.length === 0}
            mode={respectDateFilter ? 'filtered' : 'all'}
          />
        )}
      </CardContent>
    </Card>
  );
}
