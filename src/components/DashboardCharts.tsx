
import { useState, useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { useClientTransactions } from './charts/hooks/useClientTransactions';
import { useFilteredTransactions, useMonthlyChartData, useCategoryChartData } from './charts/hooks/useChartData';
import { useMetasData } from './charts/hooks/useMetasData';
import { useMetasProgress } from './charts/hooks/useMetaProgress';
import { MonthlyChartCard } from './charts/MonthlyChartCard';
import { CategoryChartsContainer } from './charts/CategoryChartsContainer';
import { MetaProgressDisplay } from './charts/MetaProgressDisplay';
import { useIsMobile } from '@/hooks/use-mobile';

type DashboardChartsProps = {
  transactions?: Transaction[];
  dateRange?: DateRange | null;
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
};

export default function DashboardCharts({ 
  transactions: propTransactions, 
  dateRange, 
  clientId,
  viewMode = 'user'
}: DashboardChartsProps) {
  // State for transaction type toggle
  const [transactionType, setTransactionType] = useState<'saída' | 'entrada'>('saída');
  const isMobile = useIsMobile();
  
  // Load client transactions if in consultor viewMode
  const clientTransactions = useClientTransactions(clientId, viewMode);
  
  // Determine which transactions to use - props or fetched client transactions
  const transactions = useMemo(() => {
    if (viewMode === 'consultor' && clientId) {
      return clientTransactions;
    }
    return propTransactions || [];
  }, [propTransactions, clientTransactions, viewMode, clientId]);
  
  // Load metas data
  const metas = useMetasData(dateRange, clientId, viewMode);
  
  // Filter transactions by date range - apenas para graficos de categoria e metas
  const filteredTransactions = useFilteredTransactions(transactions, dateRange);
  
  // Para o gráfico mensal, usamos todas as transações, independente do filtro
  
  // Prepare data for expenses or income by category pie chart
  const categoryData = useCategoryChartData(filteredTransactions, transactionType);
  
  // Calculate meta progress
  const metasComProgresso = useMetasProgress(metas, filteredTransactions);

  return (
    <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-6 mb-6`}>
      {/* Monthly Chart Card - Usando todas as transações sem filtro */}
      <MonthlyChartCard transactions={transactions} />
      
      {/* Category Charts (Pie Chart and Ranking) */}
      <CategoryChartsContainer 
        categoryData={categoryData}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />
      
      {/* Meta Progress Display */}
      <MetaProgressDisplay metasComProgresso={metasComProgresso} />
    </div>
  );
}
