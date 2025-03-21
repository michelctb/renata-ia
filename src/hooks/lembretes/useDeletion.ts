
import { useState, useEffect, useCallback } from 'react';
import { Lembrete, deleteLembrete } from '@/lib/lembretes';
import { toast } from 'sonner';

/**
 * Hook to handle lembrete deletion operations.
 * Manages deletion requests and processing state.
 * 
 * @param {string | undefined} userId - The ID of the current user
 * @param {boolean} isUserActive - Whether the user's subscription is active
 * @param {Function} loadLembretes - Function to reload lembretes data
 * @param {Function} setLembretes - Function to update lembretes state
 * @param {Lembrete[]} lembretes - Current lembretes array
 * @returns {Object} Object containing deletion state and handlers
 * @property {boolean} isProcessing - Whether a deletion operation is in progress
 * @property {Function} handleDelete - Function to handle lembrete deletion
 */
export function useDeletion(
  userId: string | undefined,
  isUserActive: boolean,
  loadLembretes: () => Promise<void>,
  setLembretes: React.Dispatch<React.SetStateAction<Lembrete[]>>,
  lembretes: Lembrete[]
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null);
  const [deleteRequestPending, setDeleteRequestPending] = useState(false);

  // Separate effect for delete requests
  useEffect(() => {
    const processDelete = async () => {
      if (!deleteRequestPending || deleteRequestId === null || !userId) {
        return;
      }
      
      if (isProcessing) {
        console.log('Already processing, will try again later');
        return;
      }
      
      try {
        console.log('Starting delete processing for ID:', deleteRequestId);
        setIsProcessing(true);
        
        // Delete from server
        await deleteLembrete(deleteRequestId);
        console.log('Delete operation completed on server');
        toast.success('Lembrete excluído com sucesso');
        
        // Reset state before reloading
        setDeleteRequestId(null);
        setDeleteRequestPending(false);
        
        // Reload the list
        await loadLembretes();
        console.log('Lembretes reloaded after delete');
      } catch (error) {
        console.error('Error completing delete operation:', error);
        toast.error('Erro ao excluir o lembrete. Tente novamente.');
        
        // Reset state
        setDeleteRequestId(null);
        setDeleteRequestPending(false);
        
        // Reload again in case of error
        loadLembretes();
      } finally {
        console.log('Delete processing complete, resetting state');
        setIsProcessing(false);
      }
    };
    
    processDelete();
  }, [deleteRequestId, userId, isProcessing, loadLembretes, deleteRequestPending]);

  /**
   * Handles deleting a lembrete.
   * Updates local state optimistically, then triggers the deletion process.
   * 
   * @param {number} id - The ID of the lembrete to delete
   */
  const handleDelete = useCallback(async (id: number) => {
    // Block inactive users from deleting lembretes
    if (!isUserActive) {
      toast.error('Sua assinatura está inativa. Você não pode excluir lembretes.');
      return;
    }
    
    if (isProcessing) {
      console.log('Already processing an operation, ignoring delete');
      toast.error('Outra operação está em andamento. Tente novamente em instantes.');
      return;
    }
    
    console.log('Delete requested for lembrete ID:', id);
    
    try {
      // First, update the local list removing the item
      // This provides immediate visual feedback to the user
      setLembretes(prevLembretes => {
        console.log('Removing lembrete from local state:', { 
          before: prevLembretes.length,
          after: prevLembretes.filter(item => item.id !== id).length,
          id
        });
        return prevLembretes.filter(item => item.id !== id);
      });
      
      // Set both flags to trigger the deletion process
      console.log('Setting deleteRequestId to trigger processing');
      setDeleteRequestId(id);
      setDeleteRequestPending(true);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('Erro ao iniciar processo de exclusão.');
    }
  }, [isProcessing, isUserActive, setLembretes]);

  return {
    isProcessing,
    handleDelete
  };
}
