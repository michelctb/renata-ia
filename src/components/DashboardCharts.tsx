
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
  
  // Log inicial para debug
  useEffect(() => {
    console.log('DashboardCharts - Inicializado com:', { 
      hasTransactions: !!propTransactions?.length,
      hasDateRange: !!dateRange,
      isMobile: isMobile,
      hasSetDateRange: !!setDateRange,
      hasOnCategorySelect: !!onCategorySelect
    });
  }, []);
  
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
  
  // Função de callback para atualizar o DateRange
  const handleDateRangeChange = (newDateRange: DateRange) => {
    console.log('DashboardCharts - Nova seleção de datas:', {
      de: newDateRange.from?.toISOString(),
      ate: newDateRange.to?.toISOString()
    });
    
    if (setDateRange) {
      console.log('DashboardCharts - Propagando dateRange para componente pai');
      setDateRange(newDateRange);
    }
  };
  
  // Integração com drill-down e outros componentes
  const {
    selectedMonth,
    selectedCategory,
    handleMonthClick,
    handleCategoryClick,
    clearAllDrilldownFilters
  } = useDashboardIntegration({
    setDateRange: handleDateRangeChange,
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
    setDateRange: handleDateRangeChange
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6">
      {/* Mostrar filtros ativos */}
      {renderActiveFilters()}
      
      {/* Monthly Chart Card - Usando todas as transações sem filtro */}
      <MonthlyChartCard 
        transactions={transactions} 
        onMonthClick={handleMonthClick}
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
