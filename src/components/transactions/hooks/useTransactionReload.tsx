
import { useState } from 'react';
import { Transaction, fetchTransactions } from '@/lib/supabase';
import { toast } from 'sonner';

type UseTransactionReloadProps = {
  userId: string;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
};

/**
 * Custom hook for reloading transactions from the server.
 * 
 * @param {Object} props - The hook's properties
 * @param {string} props.userId - The ID of the user whose transactions to load
 * @param {Function} props.setTransactions - Function to update the transactions list
 * @returns {Object} Object containing reload function and loading state
 */
export function useTransactionReload({
  userId,
  setTransactions
}: UseTransactionReloadProps) {
  const [isReloading, setIsReloading] = useState(false);
  
  /**
   * Reloads transactions from the server
   */
  const reloadTransactions = async () => {
    if (!userId) {
      console.error('No user ID provided for reloading transactions');
      return;
    }
    
    setIsReloading(true);
    
    try {
      console.log('Reloading transactions for user:', userId);
      const data = await fetchTransactions(userId);
      console.log(`Loaded ${data.length} transactions`);
      
      // Normalize the operation type in each transaction
      const normalizedData = data.map(transaction => {
        let operationType = transaction.operação;
        
        if (operationType) {
          if (operationType.toLowerCase() === 'entrada' || operationType.toLowerCase() === 'saída') {
            operationType = operationType.toLowerCase();
          }
        }
        
        return {
          ...transaction,
          operação: operationType
        };
      });
      
      setTransactions(normalizedData);
    } catch (error) {
      console.error('Error reloading transactions:', error);
      toast.error('Erro ao carregar transações. Tente novamente.');
    } finally {
      setIsReloading(false);
    }
  };

  return {
    reloadTransactions,
    isReloading
  };
}
