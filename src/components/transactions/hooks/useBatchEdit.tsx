
import { useState } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { updateTransaction } from '@/lib/supabase';
import { toast } from 'sonner';

interface UseBatchEditProps {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export function useBatchEdit({ setTransactions }: UseBatchEditProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [isBatchEditOpen, setIsBatchEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Seleciona/deseleciona uma transação
  const handleSelectTransaction = (id: number, selected: boolean) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...transaction, selected } 
          : transaction
      )
    );
    
    // Atualiza a lista de transações selecionadas
    setSelectedTransactions(prev => {
      if (selected) {
        const transaction = prev.find(t => t.id === id);
        if (!transaction) {
          // Adicionar à lista se não existir
          const transactionToAdd = prev.find(t => t.id === id) || 
                                  { id } as Transaction;
          return [...prev, transactionToAdd];
        }
        return prev;
      } else {
        // Remover da lista
        return prev.filter(t => t.id !== id);
      }
    });
  };

  // Seleciona/deseleciona todas as transações
  const handleSelectAll = (checked: boolean) => {
    setTransactions(prev => 
      prev.map(transaction => ({ ...transaction, selected: checked }))
    );
    
    if (checked) {
      // Se estiver selecionando todos, atualiza a lista com todas as transações
      setSelectedTransactions(prev => 
        prev.map(transaction => ({ ...transaction, selected: true }))
      );
    } else {
      // Se estiver desmarcando todos, limpa a lista
      setSelectedTransactions([]);
    }
  };

  // Abre o modal de edição em lote
  const openBatchEdit = () => {
    // Atualiza a lista de transações selecionadas com os dados completos
    setTransactions(prev => {
      const selectedIds = prev.filter(t => t.selected).map(t => t.id);
      const selectedItems = prev.filter(t => selectedIds.includes(t.id));
      setSelectedTransactions(selectedItems);
      return prev;
    });
    
    setIsBatchEditOpen(true);
  };

  // Fecha o modal de edição em lote
  const closeBatchEdit = () => {
    setIsBatchEditOpen(false);
  };

  // Processa a edição em lote
  const processBatchEdit = async (updates: Partial<Transaction>) => {
    if (Object.keys(updates).length === 0 || selectedTransactions.length === 0) {
      toast.error("Nenhuma alteração para aplicar");
      return;
    }

    setIsUpdating(true);
    try {
      // Cria um array de promessas para atualizar todas as transações
      const updatePromises = selectedTransactions.map(async (transaction) => {
        const updatedTransaction = {
          ...transaction,
          ...updates
        };
        
        // Remover o campo 'selected' antes de enviar para a API
        delete updatedTransaction.selected;
        
        await updateTransaction(updatedTransaction);
        return updatedTransaction;
      });

      await Promise.all(updatePromises);

      // Atualiza o estado local com as transações atualizadas
      setTransactions(prev => {
        return prev.map(transaction => {
          if (transaction.selected) {
            return {
              ...transaction,
              ...updates,
              selected: false // Reset selection
            };
          }
          return transaction;
        });
      });

      // Limpa a seleção após edição bem-sucedida
      setSelectedTransactions([]);
      setIsBatchEditOpen(false);
      
      toast.success(`${selectedTransactions.length} transações atualizadas com sucesso`);
    } catch (error) {
      console.error("Erro ao atualizar transações em lote:", error);
      toast.error("Erro ao atualizar transações. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    selectedTransactions,
    isBatchEditOpen,
    isUpdating,
    handleSelectTransaction,
    handleSelectAll,
    openBatchEdit,
    closeBatchEdit,
    processBatchEdit
  };
}
