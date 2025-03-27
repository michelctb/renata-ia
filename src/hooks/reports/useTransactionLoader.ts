
import { useState, useEffect } from 'react';
import { fetchTransactions } from '@/lib/supabase/transactions';
import { normalizeOperationType } from './reportDataUtils';
import { toast } from 'sonner';

/**
 * Hook para carregar transações de um cliente
 */
export function useTransactionLoader(selectedClient: string | null) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadClientTransactions = async () => {
      if (!selectedClient) {
        setTransactions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await fetchTransactions(selectedClient);
        
        // Normalizar os tipos de operações antes de processar
        const normalizedData = data.map(transaction => ({
          ...transaction,
          operação: normalizeOperationType(transaction.operação || '')
        }));
        
        setTransactions(normalizedData);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        toast.error("Não foi possível carregar as transações");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClientTransactions();
  }, [selectedClient]);

  return {
    transactions,
    isLoading
  };
}
