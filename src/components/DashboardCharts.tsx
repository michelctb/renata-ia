
import { useEffect } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { useIsMobile } from '@/hooks/use-mobile';
import { MonthlyChartCard } from './charts/MonthlyChartCard';
import { CategoryChartsContainer } from './charts/CategoryChartsContainer';
import { MetaProgressDisplay } from './charts/MetaProgressDisplay';
import { useDashboardState } from './charts/hooks/useDashboardState';
import { useDashboardIntegration } from './charts/hooks/useDashboardIntegration';
import { useDashboardData } from './charts/hooks/useDashboardData';
import { useDashboardUI } from './charts/hooks/useDashboardUI';

type DashboardChartsProps = {
  transactions?: Transaction[];
  dateRange?: DateRange | null;
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
  setDateRange?: (dateRange: DateRange) => void;
  onCategorySelect?: (category: string | null) => void;
};

export default function DashboardCharts({ 
  transactions: propTransactions, 
  dateRange, 
  clientId,
  viewMode = 'user',
  setDateRange,
  onCategorySelect
}: DashboardChartsProps) {
  // Detector de dispositivo móvel
  const isMobile = useIsMobile();
  
  // Estado base do dashboard
  const {
    transactionType,
    setTransactionType,
    validDateRange,
    viewMode: normalizedViewMode,
    clientId: normalizedClientId
  } = useDashboardState({
    transactions: propTransactions,
    dateRange,
    clientId,
    viewMode,
    setDateRange
  });
  
  // Integração com drill-down e outros componentes
  const {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  } = useDashboardIntegration({
    setDateRange,
    onCategoryFilterChange: onCategorySelect
  });
  
  // Preparação de dados para o dashboard
  const {
    transactions,
    filteredTransactions,
    filteredByCategory,
    categoryData,
    metasComProgresso
  } = useDashboardData({
    propTransactions,
    validDateRange,
    clientId,
    viewMode: normalizedViewMode,
    selectedCategory,
    transactionType
  });
  
  // Componentes de UI do dashboard
  const {
    renderActiveFilters
  } = useDashboardUI({
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters,
    setDateRange // Passando a função, não o objeto DateRange
  });
  
  // Logging para debug
  useEffect(() => {
    console.log('DashboardCharts - Estado atual:');
    console.log('- Categoria selecionada:', selectedCategory);
    console.log('- Mês selecionado:', selectedMonth);
    console.log('- Transações filtradas:', filteredTransactions.length);
    console.log('- DateRange válido:', validDateRange);
    if (selectedCategory) {
      console.log('- Transações filtradas por categoria:', filteredByCategory.length);
    }
  }, [selectedCategory, selectedMonth, filteredTransactions, filteredByCategory.length, validDateRange]);

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
