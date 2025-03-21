
import { useState, useEffect, useCallback } from 'react';
import { fetchLembretes, Lembrete, deleteLembrete } from '@/lib/lembretes';
import { toast } from 'sonner';

interface UseLembretesProps {
  userId: string | undefined;
  isUserActive: boolean;
}

/**
 * Custom hook for managing lembretes (reminders).
 * Handles fetching, adding, updating, and deleting lembretes.
 * 
 * @param {Object} props - The hook's properties
 * @param {string | undefined} props.userId - The ID of the current user
 * @param {boolean} props.isUserActive - Whether the user's subscription is active
 * @returns {Object} Object containing lembretes data and handler functions
 * @property {Lembrete[]} lembretes - The list of lembretes for the current user
 * @property {boolean} isLoading - Whether the lembretes are currently being loaded
 * @property {boolean} isProcessing - Whether an operation is in progress
 * @property {Function} handleFormSubmit - Function to handle form submission (add/update)
 * @property {Function} handleDelete - Function to handle lembrete deletion
 */
export function useLembretes({ userId, isUserActive }: UseLembretesProps) {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formSubmissionCount, setFormSubmissionCount] = useState(0);
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null);
  const [deleteRequestPending, setDeleteRequestPending] = useState(false);

  // Debug the state changes 
  useEffect(() => {
    console.log('useLembretes state update:', { 
      lembretesCount: lembretes.length, 
      isLoading, 
      isProcessing, 
      deleteRequestId,
      deleteRequestPending
    });
  }, [lembretes, isLoading, isProcessing, deleteRequestId, deleteRequestPending]);

  /**
   * Loads lembretes from the database.
   * Used for initial loading and refreshing after operations.
   */
  const loadLembretes = useCallback(async () => {
    if (!userId) {
      console.log('No userId, skipping loadLembretes');
      return;
    }
    
    try {
      console.log('Loading lembretes...');
      setIsLoading(true);
      const data = await fetchLembretes(userId);
      console.log(`Loaded ${data.length} lembretes for user ${userId}`);
      
      // Always use a functional update to avoid race conditions
      setLembretes(prevState => {
        console.log('Updating lembretes state from:', prevState.length, 'items to', data.length, 'items');
        return data;
      });
    } catch (error) {
      console.error('Error loading lembretes:', error);
      toast.error('Erro ao carregar lembretes. Atualize a página.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial load on component mount
  useEffect(() => {
    console.log('User effect triggered, loading lembretes');
    loadLembretes();
  }, [loadLembretes]);

  // Separate effect for form submission to avoid race conditions
  useEffect(() => {
    if (formSubmissionCount > 0) {
      console.log('Form submission detected, reloading lembretes');
      loadLembretes();
    }
  }, [formSubmissionCount, loadLembretes]);

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
   * Handles form submission for adding or updating a lembrete.
   * Updates local state optimistically, then triggers a reload.
   * 
   * @param {Lembrete} data - The lembrete data to submit
   */
  const handleFormSubmit = async (data: Lembrete) => {
    if (isProcessing) {
      console.log('Already processing a submission, ignoring');
      return;
    }
    
    try {
      console.log('Starting form submission processing');
      setIsProcessing(true);
      console.log('Form submitted with data:', data);
      
      // Update local list first with the new lembrete
      if (data.id) {
        // Edit case - update existing item
        console.log('Updating local list with edited item');
        setLembretes(prevLembretes => 
          prevLembretes.map(item => 
            item.id === data.id ? data : item
          )
        );
      } else {
        // Add case - add new item
        console.log('Adding new item to local list');
        if (data.id) {
          setLembretes(prevLembretes => [...prevLembretes, data]);
        }
      }
      
      // Trigger a reload via the submission counter
      console.log('Incrementing form submission counter to trigger reload');
      setFormSubmissionCount(prev => prev + 1);
      
    } catch (error) {
      console.error('Error updating lembretes list:', error);
      toast.error('Erro ao atualizar a lista de lembretes.');
    } finally {
      console.log('Form submission processing complete');
      setIsProcessing(false);
    }
  };

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
  }, [isProcessing, isUserActive]);

  return {
    lembretes,
    isLoading,
    isProcessing,
    handleFormSubmit,
    handleDelete,
  };
}
