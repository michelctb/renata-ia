
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyChart } from './MonthlyChart';
import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { useMonthlyChartData } from './hooks/useChartData';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

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
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isMobile = useIsMobile();
  
  // Log para debug dos dados recebidos
  useEffect(() => {
    console.log("MonthlyChartCard - dados recebidos:", {
      hasDirectData: !!data,
      hasTransactions: !!transactions?.length,
      transactionsCount: transactions?.length || 0
    });
  }, [data, transactions]);
  
  // Efeito para mostrar toast apenas uma vez em caso de erro
  useEffect(() => {
    if (hasError) {
      toast({
        title: "Erro no gráfico mensal",
        description: "Não foi possível processar os dados para o gráfico",
        variant: "destructive"
      });
    }
  }, [hasError]);
  
  // Log para debug na primeira renderização
  useEffect(() => {
    console.log('MonthlyChartCard - Inicializado com:', {
      selectedMonth,
      hasMonthClickCallback: !!onMonthClick,
      hasDirectData: !!data,
      hasTransactions: !!transactions?.length,
      transactionsCount: transactions?.length || 0
    });
  }, [selectedMonth, onMonthClick, data, transactions]);
  
  // Se os dados forem fornecidos diretamente, use-os
  // Caso contrário, processe os dados de todas as transações
  let chartData: any[] = [];
  
  try {
    if (data) {
      chartData = data;
      console.log("MonthlyChartCard - usando dados diretos:", chartData);
    } else {
      if (!transactions || transactions.length === 0) {
        console.log("MonthlyChartCard - sem transações para processar");
      } else {
        try {
          chartData = useMonthlyChartData(transactions || []);
          console.log("MonthlyChartCard - dados processados:", chartData);
        } catch (error) {
          console.error('Erro ao processar dados do gráfico mensal:', error);
          setHasError(true);
          setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido no processamento de dados");
        }
      }
    }
  } catch (error) {
    console.error('Erro geral no MonthlyChartCard:', error);
    setHasError(true);
    setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
  }
  
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
        <CardTitle className="text-lg">Entradas e Saídas por Mês</CardTitle>
        <CardDescription>
          Visualização mensal de valores recebidos e pagos 
          {isMobile ? ' ' : ' (todos os períodos) '}
          {selectedMonth && <span className="ml-1 text-blue-500 font-medium">• Filtro: {selectedMonth}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] pb-4">
        {hasError ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <p className="mb-2">Erro ao processar dados do gráfico</p>
            <p className="mb-4 text-xs text-red-500">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm text-primary hover:underline"
            >
              Recarregar página
            </button>
          </div>
        ) : (
          <MonthlyChart 
            data={chartData} 
            onMonthClick={onMonthClick ? handleMonthClick : undefined}
            selectedMonth={selectedMonth}
          />
        )}
      </CardContent>
    </Card>
  );
}
