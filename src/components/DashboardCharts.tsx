
import { useState, useMemo, useEffect } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { useClientTransactions } from './charts/hooks/useClientTransactions';
import { useFilteredTransactions } from './charts/hooks/useFilteredTransactions';
import { useMonthlyChartData, useCategoryChartData } from './charts/hooks/useChartData';
import { useMetasData } from './charts/hooks/useMetasData';
import { useMetasProgress } from './charts/hooks/useMetaProgress';
import { useChartDrilldown } from './charts/hooks/useChartDrilldown';
import { useDrilldownFiltering } from './charts/hooks/useDrilldownFiltering';
import { MonthlyChartCard } from './charts/MonthlyChartCard';
import { CategoryChartsContainer } from './charts/CategoryChartsContainer';
import { MetaProgressDisplay } from './charts/MetaProgressDisplay';
import { ActiveFilters } from './charts/ActiveFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDateValidation } from '@/hooks/useDateValidation';

type DashboardChartsProps = {
  transactions?: Transaction[];
  dateRange?: DateRange | null;
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
  setDateRange?: (dateRange: DateRange) => void;
};

export default function DashboardCharts({ 
  transactions: propTransactions, 
  dateRange, 
  clientId,
  viewMode = 'user',
  setDateRange
}: DashboardChartsProps) {
  // State for transaction type toggle
  const [transactionType, setTransactionType] = useState<'saída' | 'entrada'>('saída');
  const isMobile = useIsMobile();
  const { isValidDateRange, getSafeDateRange } = useDateValidation();
  
  // Usar um dateRange validado para evitar problemas com datas inválidas
  const validDateRange = useMemo(() => {
    return getSafeDateRange(dateRange);
  }, [dateRange, getSafeDateRange]);
  
  // Load client transactions if in consultor viewMode
  const clientTransactions = useClientTransactions(clientId, viewMode);
  
  // Determine which transactions to use - props or fetched client transactions
  const transactions = useMemo(() => {
    if (viewMode === 'consultor' && clientId) {
      return clientTransactions;
    }
    return propTransactions || [];
  }, [propTransactions, clientTransactions, viewMode, clientId]);
  
  // Usar o hook de drill-down para gerenciar filtros interativos
  const {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  } = useChartDrilldown({
    onDateRangeChange: setDateRange,
    onCategoryFilterChange: () => {} // Vamos usar o estado interno do hook
  });
  
  // Certifique-se de que estamos passando o selectedCategory para o TransactionsTab
  useEffect(() => {
    console.log('Categoria selecionada mudou para:', selectedCategory);
  }, [selectedCategory]);
  
  // Load metas data
  const metas = useMetasData(validDateRange, clientId, viewMode);
  
  // Filter transactions by date range - apenas para graficos de categoria e metas
  const filteredTransactions = useFilteredTransactions(transactions, validDateRange);
  
  // Filtrar transações por categoria se necessário
  const { filteredByCategory } = useDrilldownFiltering(
    filteredTransactions,
    selectedCategory
  );
  
  // Para o gráfico mensal, usamos todas as transações, independente do filtro
  
  // Prepare data for expenses or income by category pie chart
  // Usar filteredByCategory se tiver categoria selecionada
  const categoryData = useCategoryChartData(
    selectedCategory ? filteredByCategory : filteredTransactions, 
    transactionType
  );
  
  // Calculate meta progress
  const metasComProgresso = useMetasProgress(metas, filteredTransactions);

  // Renderizar os filtros ativos
  const renderActiveFilters = () => {
    // Se não temos como alterar o dateRange, não mostramos o filtro de mês
    if (!setDateRange && !selectedCategory) return null;
    
    return (
      <ActiveFilters
        selectedMonth={selectedMonth}
        selectedCategory={selectedCategory}
        onClearMonth={() => {
          if (setDateRange) {
            handleMonthClick(selectedMonth!);  // Clicando novamente no mesmo mês remove o filtro
          }
        }}
        onClearCategory={() => {
          handleCategoryClick(selectedCategory!);  // Clicando novamente na mesma categoria remove o filtro
        }}
        onClearAll={clearAllDrilldownFilters}
      />
    );
  };

  // Passar informações extras para o console para debug
  useEffect(() => {
    console.log('DashboardCharts - Estado atual:');
    console.log('- Categoria selecionada:', selectedCategory);
    console.log('- Mês selecionado:', selectedMonth);
    console.log('- Transactions filtradas:', filteredTransactions.length);
    if (selectedCategory) {
      console.log('- Transações filtradas por categoria:', filteredByCategory.length);
    }
  }, [selectedCategory, selectedMonth, filteredTransactions, filteredByCategory.length]);

  return (
    <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-6 mb-6`}>
      {/* Mostrar filtros ativos */}
      {renderActiveFilters()}
      
      {/* Monthly Chart Card - Usando todas as transações sem filtro */}
      <MonthlyChartCard 
        transactions={transactions} 
        onMonthClick={setDateRange ? handleMonthClick : undefined}
        selectedMonth={selectedMonth}
      />
      
      {/* Category Charts (Pie Chart and Ranking) */}
      <CategoryChartsContainer 
        categoryData={categoryData}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        onCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
      />
      
      {/* Meta Progress Display */}
      <MetaProgressDisplay metasComProgresso={metasComProgresso} />
    </div>
  );
}
