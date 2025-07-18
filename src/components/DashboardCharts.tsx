
import { useEffect } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { useIsMobile } from '@/hooks/use-mobile';
import { CategoryChartsContainer } from './charts/CategoryChartsContainer';
import { MetaProgressDisplay } from './charts/MetaProgressDisplay';
import { MonthlyBarChart } from './charts/monthly-chart/MonthlyBarChart';
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
  transactions: propTransactions = [],
  dateRange, 
  clientId,
  viewMode = 'user',
  setDateRange,
  onCategorySelect
}: DashboardChartsProps) {
  // Detector de dispositivo móvel
  const isMobile = useIsMobile();
  
  // Garantir que propTransactions é sempre um array
  const safeTransactions = Array.isArray(propTransactions) ? propTransactions : [];
  
  // Log inicial para debug
  useEffect(() => {
    console.log('DashboardCharts - Inicializado com:', { 
      hasTransactions: Array.isArray(safeTransactions) && safeTransactions.length > 0,
      transactionCount: safeTransactions.length,
      hasDateRange: !!dateRange,
      isMobile: isMobile,
      hasSetDateRange: !!setDateRange,
      hasOnCategorySelect: !!onCategorySelect
    });
    
    if (dateRange) {
      console.log('DashboardCharts - Date Range:', {
        from: dateRange.from?.toISOString(),
        to: dateRange.to?.toISOString()
      });
    }
  }, [safeTransactions, dateRange, isMobile, setDateRange, onCategorySelect]);
  
  // Estado base do dashboard
  const {
    transactionType,
    setTransactionType,
    validDateRange,
    viewMode: normalizedViewMode,
    clientId: normalizedClientId
  } = useDashboardState({
    transactions: safeTransactions,
    dateRange,
    clientId,
    viewMode,
    setDateRange
  });
  
  // Integração com drill-down e outros componentes
  const {
    selectedCategory,
    handleCategoryClick,
    clearAllDrilldownFilters
  } = useDashboardIntegration({
    onCategoryFilterChange: onCategorySelect
  });
  
  // Preparação de dados para o dashboard
  const {
    filteredTransactions,
    filteredByCategory,
    categoryData,
    metasComProgresso
  } = useDashboardData({
    propTransactions: safeTransactions,
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
    selectedCategory,
    handleCategoryClick,
    clearAllDrilldownFilters
  });
    
  // Verificar e logar quantidades de transações
  useEffect(() => {
    console.log('DashboardCharts - Contagem de transações:', {
      total: safeTransactions.length,
      filtradas: Array.isArray(filteredTransactions) ? filteredTransactions.length : 0,
      porCategoria: Array.isArray(filteredByCategory) ? filteredByCategory.length : 0
    });
  }, [safeTransactions, filteredTransactions, filteredByCategory]);

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6">
      {/* Mostrar filtros ativos */}
      {renderActiveFilters()}
      
      {/* Monthly Bar Chart */}
      <MonthlyBarChart 
        transactions={safeTransactions}
      />
      
      {/* Category Charts (Pie Chart and Ranking) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 col-span-1">
        <CategoryChartsContainer 
          categoryData={categoryData || []}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />
      </div>
      
      {/* Meta Progress Display */}
      <MetaProgressDisplay metasComProgresso={metasComProgresso || []} />
    </div>
  );
}
