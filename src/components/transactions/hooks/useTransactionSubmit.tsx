
import { useState, useRef } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { addTransaction, updateTransaction } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export type UseTransactionSubmitProps = {
  userId: string;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onSuccess?: () => void;
};

/**
 * Custom hook for submitting (adding or updating) transactions.
 * Handles the form submission process, validation, and state updates.
 * 
 * @param {Object} props - The hook's properties
 * @param {string} props.userId - The ID of the current user
 * @param {Function} props.setTransactions - Function to update the transactions list
 * @param {Function} props.onSuccess - Function called on successful submission
 * @returns {Object} Object containing the submission handler and loading state
 */
export function useTransactionSubmit({ 
  userId,
  setTransactions, 
  onSuccess 
}: UseTransactionSubmitProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ref to track if callbacks have been executed
  const callbackExecuted = useRef(false);

  /**
   * Handles adding or updating a transaction.
   * Validates input, submits to API, and updates local state.
   * 
   * @param {Transaction} transaction - The transaction to add or update
   */
  const handleSubmitTransaction = async (transaction: Transaction) => {
    if (!user) {
      toast.error('Você precisa estar logado para realizar esta operação.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Processing transaction:', transaction);
      console.log('Processing transaction with user ID:', userId);
      
      // Reset callback executed flag
      callbackExecuted.current = false;
      
      // Ensure all required fields are present
      if (!transaction.data || !transaction.descrição || !transaction.operação || !transaction.categoria) {
        console.error('Dados de transação incompletos:', transaction);
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      // Normalize the operation type to lowercase for consistency
      let operationType = transaction.operação.toLowerCase();
      
      // Ensure it's one of our allowed types
      if (operationType === 'entrada' || operationType === 'saída') {
        // Create a new transaction object with the normalized operation
        const transactionWithClient = {
          ...transaction,
          id_cliente: userId, // Make sure id_cliente is properly set
          operação: operationType as 'entrada' | 'saída'
        };
        
        console.log('Final transaction to submit:', transactionWithClient);
        
        if (transaction.id) {
          // Update existing transaction
          console.log('Updating transaction with ID:', transaction.id);
          const updated = await updateTransaction(transactionWithClient);
          console.log('Updated transaction:', updated);
          
          if (updated) {
            console.log('Setting updated transaction in state');
            
            // Then update the state
            setTransactions(prev => {
              // Create a new array with the updated transaction
              const newTransactions = prev.map(t => 
                t.id === transaction.id ? updated : t
              );
              console.log('New transactions array after update:', newTransactions.length);
              return newTransactions;
            });
            
            // Call onSuccess callback if provided
            if (onSuccess && !callbackExecuted.current) {
              callbackExecuted.current = true;
              onSuccess();
            }
            
            toast.success('Transação atualizada com sucesso!');
          } else {
            console.error('No updated transaction returned from the API');
            toast.error('Erro ao atualizar a transação. Tente novamente.');
          }
        } else {
          // Add new transaction - ensure we're not sending an ID
          console.log('Adding new transaction without ID');
          const { id, ...transactionWithoutId } = transactionWithClient;
          
          const added = await addTransaction(transactionWithoutId as Transaction);
          console.log('Added transaction:', added);
          
          if (added) {
            console.log('Setting added transaction in state');
            
            // Then update the state
            setTransactions(prev => {
              // Create a new array with the added transaction at the beginning
              const newTransactions = [added, ...prev];
              console.log('New transactions array after add:', newTransactions.length);
              return newTransactions;
            });
            
            // Call onSuccess callback if provided
            if (onSuccess && !callbackExecuted.current) {
              callbackExecuted.current = true;
              onSuccess();
            }
            
            toast.success('Transação adicionada com sucesso!');
          } else {
            console.error('No added transaction returned from the API');
            toast.error('Erro ao adicionar a transação. Tente novamente.');
          }
        }
      } else {
        console.error('Tipo de operação inválido:', operationType);
        toast.error('Tipo de operação inválido. Use "entrada" ou "saída".');
      }
    } catch (error) {
      console.error('Error with transaction:', error);
      toast.error('Erro ao salvar a transação. Tente novamente.');
      // Don't close the form on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmitTransaction,
    isSubmitting
  };
}
