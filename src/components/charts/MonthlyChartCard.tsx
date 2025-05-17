
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyChart } from './MonthlyChart';
import { useEffect, useState, useMemo } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { useMonthlyChartData } from './hooks/useChartData';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChartIcon, CalendarIcon } from 'lucide-react';

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
  transactions, 
  filteredTransactions = [],
  clientId,
  onMonthClick,
  selectedMonth,
  dateFilterDescription
}: MonthlyChartCardProps) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isMobile = useIsMobile();
  
  // Estado para controlar se o gráfico deve respeitar o filtro de data
  const [respectDateFilter, setRespectDateFilter] = useState<boolean>(false);
  
  // Processar os dados com useMonthlyChartData no nível superior do componente
  // Este hook deve ser chamado SEMPRE, independente das condições
  const allDataProcessed = useMonthlyChartData(transactions || []);
  const filteredDataProcessed = useMonthlyChartData(filteredTransactions || []);
  
  // Log para debug dos dados recebidos
  useEffect(() => {
    console.log("MonthlyChartCard - dados recebidos:", {
      hasDirectData: !!data,
      hasTransactions: !!transactions?.length,
      transactionsCount: transactions?.length || 0,
      hasFilteredTransactions: !!filteredTransactions?.length,
      filteredTransactionsCount: filteredTransactions?.length || 0,
      respectingFilter: respectDateFilter
    });
  }, [data, transactions, filteredTransactions, respectDateFilter]);
  
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
      transactionsCount: transactions?.length || 0,
      filteredTransactionsCount: filteredTransactions?.length || 0
    });
  }, [selectedMonth, onMonthClick, data, transactions, filteredTransactions]);
  
  // Agora use useMemo apenas para processamento de dados, não para chamar hooks
  const chartData = useMemo(() => {
    try {
      // Se dados diretos forem fornecidos, use-os
      if (data) {
        console.log("MonthlyChartCard - usando dados diretos:", data);
        return data;
      } else {
        // Se não, selecione entre dados completos ou filtrados
        const transactionsToUse = respectDateFilter ? filteredTransactions : transactions;
        
        if (!transactionsToUse || transactionsToUse.length === 0) {
          console.log("MonthlyChartCard - sem transações para processar");
          return [];
        } else {
          try {
            // Use os dados pré-processados correspondentes
            const dataToUse = respectDateFilter ? filteredDataProcessed : allDataProcessed;
            console.log("MonthlyChartCard - dados processados:", dataToUse, 
              "modo:", respectDateFilter ? "filtrado" : "completo");
            return dataToUse;
          } catch (error) {
            console.error('Erro ao processar dados do gráfico mensal:', error);
            setHasError(true);
            setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido no processamento de dados");
            return [];
          }
        }
      }
    } catch (error) {
      console.error('Erro geral no MonthlyChartCard:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
      return [];
    }
  }, [data, transactions, filteredTransactions, respectDateFilter, allDataProcessed, filteredDataProcessed]);
  
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <BarChartIcon 
                    className={`h-4 w-4 ${!respectDateFilter ? 'text-primary' : 'text-muted-foreground'}`} 
                  />
                  <Switch 
                    checked={respectDateFilter}
                    onCheckedChange={setRespectDateFilter}
                    aria-label="Alternar modo do gráfico"
                  />
                  <CalendarIcon 
                    className={`h-4 w-4 ${respectDateFilter ? 'text-primary' : 'text-muted-foreground'}`} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{respectDateFilter ? 'Modo filtrado: Mostra apenas dados do período selecionado' : 'Modo completo: Mostra dados de todos os períodos'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <CardDescription>
          {respectDateFilter ? 
            `Visualização de valores por mês (período filtrado${dateFilterDescription ? `: ${dateFilterDescription}` : ''})` : 
            'Visualização mensal de valores recebidos e pagos (todos os períodos)'}
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
            isEmpty={chartData.length === 0}
            mode={respectDateFilter ? 'filtered' : 'all'}
          />
        )}
      </CardContent>
    </Card>
  );
}
