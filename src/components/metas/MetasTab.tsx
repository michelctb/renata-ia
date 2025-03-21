
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { useMetasData } from './hooks/useMetasData';
import { useMetaProgress } from './hooks/useMetaProgress';
import { usePeriodoDateRange } from './hooks/usePeriodoDateRange';
import { MetasHeader } from './components/MetasHeader';
import { MetasCard } from './components/MetasCard';

interface MetasTabProps {
  transactions: Transaction[];
  dateRange: DateRange | null;
  setDateRange: (dateRange: DateRange | null) => void;
}

export default function MetasTab({ transactions, dateRange: externalDateRange, setDateRange: setExternalDateRange }: MetasTabProps) {
  const { user } = useAuth();
  const { metas, isLoading, handleSaveMeta, handleDeleteMeta } = useMetasData(user?.id);
  const { 
    periodoFiltro, 
    dateRange: internalDateRange, 
    setDateRange: setInternalDateRange, 
    handleChangePeriodo 
  } = usePeriodoDateRange();
  
  // Use the external date range if provided, otherwise use internal
  const effectiveDateRange = externalDateRange || internalDateRange;
  const setEffectiveDateRange = (range: DateRange | null) => {
    setInternalDateRange(range);
    setExternalDateRange(range);
  };
  
  // Calculate meta progress
  const metasProgresso = useMetaProgress(metas, transactions, effectiveDateRange);
  
  if (isLoading) {
    return (
      <div className="container px-4 py-8 max-w-7xl">
        <div className="animate-pulse text-lg text-center">Carregando metas...</div>
      </div>
    );
  }
  
  const periodoAtual = (() => {
    if (effectiveDateRange?.from) {
      if (periodoFiltro === 'mensal') {
        return format(effectiveDateRange.from, 'MMMM yyyy');
      } else if (periodoFiltro === 'anual') {
        return `Ano ${effectiveDateRange.from.getFullYear()}`;
      }
    }
    return format(new Date(), 'MMMM yyyy');
  })();
  
  return (
    <div className="space-y-6">
      <MetasHeader 
        periodoFiltro={periodoFiltro}
        dateRange={effectiveDateRange}
        onChangePeriodo={handleChangePeriodo}
        onDateRangeChange={setEffectiveDateRange}
      />
      
      <MetasCard 
        userId={user?.id || ''}
        metasProgresso={metasProgresso}
        periodoAtual={periodoAtual}
        onSaveMeta={handleSaveMeta}
        onDeleteMeta={handleDeleteMeta}
      />
    </div>
  );
}
