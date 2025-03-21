
import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/supabase';
import { fetchTransactionsByClientId } from '@/lib/supabase/transactions';

export function useClientTransactions(clientId?: string, viewMode: 'user' | 'admin' | 'consultor' = 'user') {
  const [clientTransactions, setClientTransactions] = useState<Transaction[]>([]);
  
  // Load client transactions if in consultor viewMode
  useEffect(() => {
    const loadClientTransactions = async () => {
      if (!clientId || viewMode !== 'consultor') return;
      
      try {
        const transactions = await fetchTransactionsByClientId(clientId);
        setClientTransactions(transactions);
      } catch (error) {
        console.error('Error loading client transactions for charts:', error);
      }
    };
    
    loadClientTransactions();
  }, [clientId, viewMode]);
  
  return clientTransactions;
}
