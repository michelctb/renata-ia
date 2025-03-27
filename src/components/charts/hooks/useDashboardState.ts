
import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/lib/supabase';
import { useDateValidation } from '@/hooks/useDateValidation';

type UseDashboardStateProps = {
  transactions?: Transaction[];
  dateRange?: DateRange | null;
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
  setDateRange?: (dateRange: DateRange) => void;
};

/**
 * Hook para gerenciar o estado base do dashboard de charts
 */
export function useDashboardState({
  transactions: propTransactions,
  dateRange,
  clientId,
  viewMode = 'user',
  setDateRange
}: UseDashboardStateProps) {
  // Estado para o tipo de transação selecionado
  const [transactionType, setTransactionType] = useState<'saída' | 'entrada'>('saída');
  
  // Validar o dateRange para evitar problemas com datas inválidas
  const { isValidDateRange, getSafeDateRange } = useDateValidation();
  
  // Obter um dateRange validado
  const validDateRange = useMemo(() => {
    return getSafeDateRange(dateRange);
  }, [dateRange, getSafeDateRange]);

  return {
    transactionType,
    setTransactionType,
    validDateRange,
    viewMode,
    clientId
  };
}
