
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { useClientTransactions } from './useClientTransactions';
import { useFilteredTransactions } from './useFilteredTransactions';
import { useCategoryChartData } from './useChartData';
import { useMetasData } from './useMetasData';
import { useMetasProgress } from './useMetaProgress';
import { useDrilldownFiltering } from './useDrilldownFiltering';

type UseDashboardDataProps = {
  propTransactions?: Transaction[];
  validDateRange: DateRange | null;
  clientId?: string;
  viewMode: 'user' | 'admin' | 'consultor';
  selectedCategory: string | null;
  transactionType: 'saída' | 'entrada';
};

/**
 * Hook para preparar e processar dados para o dashboard
 */
export function useDashboardData({
  propTransactions,
  validDateRange,
  clientId,
  viewMode,
  selectedCategory,
  transactionType
}: UseDashboardDataProps) {
  // Carregar transações do cliente se estiver no modo consultor
  const clientTransactions = useClientTransactions(clientId, viewMode);
  
  // Determinar quais transações usar - props ou transações do cliente
  const transactions = useMemo(() => {
    if (viewMode === 'consultor' && clientId) {
      return clientTransactions;
    }
    return propTransactions || [];
  }, [propTransactions, clientTransactions, viewMode, clientId]);
  
  // Carregar dados de metas
  const metas = useMetasData(validDateRange, clientId, viewMode);
  
  // Filtrar transações pelo intervalo de datas
  const filteredTransactions = useFilteredTransactions(transactions, validDateRange);
  
  // Filtrar transações por categoria se necessário
  const { filteredByCategory } = useDrilldownFiltering(
    filteredTransactions,
    selectedCategory
  );
  
  // Preparar dados para gráfico de categoria
  const categoryData = useCategoryChartData(
    selectedCategory ? filteredByCategory : filteredTransactions,
    transactionType
  );
  
  // Calcular progresso das metas
  const metasComProgresso = useMetasProgress(metas, filteredTransactions);

  return {
    transactions,
    filteredTransactions,
    filteredByCategory,
    categoryData,
    metasComProgresso
  };
}
