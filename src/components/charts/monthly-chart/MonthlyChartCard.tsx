
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyChart } from './MonthlyChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { Transaction } from '@/lib/supabase/types';
import { ChartFilterToggle } from './ChartFilterToggle';
import { ChartErrorDisplay } from './ChartErrorDisplay';
import { useMonthlyChartCardData } from '../hooks/monthlyChart';

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
  const safeData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  
  // Log para debug dos dados recebidos
  console.log("MonthlyChartCard - dados recebidos:", {
    hasDirectData: safeData.length > 0,
    hasTransactions: transactions?.length > 0,
    transactionsCount: transactions?.length,
    hasFilteredTransactions: filteredTransactions?.length > 0,
    filteredTransactionsCount: filteredTransactions?.length,
    respectingFilter: respectDataFilter
  });
  
  // Uso do hook refatorado para processamento de dados
  const {
    chartData,
    hasError,
    errorMessage,
  } = useMonthlyChartCardData({
    data: safeData,
    transactions,
    filteredTransactions,
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
            isEmpty={!chartData.length}
            mode={respectDateFilter ? 'filtered' : 'all'}
          />
        )}
      </CardContent>
    </Card>
  );
}
