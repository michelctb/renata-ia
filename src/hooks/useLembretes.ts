
import { useState, useEffect, useCallback } from 'react';
import { fetchLembretes, Lembrete, deleteLembrete } from '@/lib/lembretes';
import { toast } from 'sonner';

interface UseLembretesProps {
  userId: string | undefined;
  isUserActive: boolean;
}

export function useLembretes({ userId, isUserActive }: UseLembretesProps) {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formSubmissionCount, setFormSubmissionCount] = useState(0);
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null);

  // Use useCallback for loadLembretes to prevent unnecessary recreation
  const loadLembretes = useCallback(async () => {
    if (!userId) return;
    
    try {
      console.log('Loading lembretes...');
      setIsLoading(true);
      const data = await fetchLembretes(userId);
      console.log(`Loaded ${data.length} lembretes for user ${userId}`);
      setLembretes(data);
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
    if (deleteRequestId === null || !userId) return;
    
    const processDelete = async () => {
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
        
        // Reload the list
        await loadLembretes();
        console.log('Lembretes reloaded after delete');
      } catch (error) {
        console.error('Error completing delete operation:', error);
        toast.error('Erro ao excluir o lembrete. Tente novamente.');
        // Reload again in case of error
        loadLembretes();
      } finally {
        console.log('Delete processing complete, resetting state');
        setDeleteRequestId(null);
        setIsProcessing(false);
      }
    };
    
    processDelete();
  }, [deleteRequestId, userId, isProcessing, loadLembretes]);

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

  const handleDelete = async (id: number) => {
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
    
    // First, update the local list removing the item
    // This provides immediate visual feedback to the user
    setLembretes(prevLembretes => {
      console.log('Removing lembrete from local state');
      return prevLembretes.filter(item => item.id !== id);
    });
    
    // Instead of performing the deletion directly, we schedule it
    // to be processed by the useEffect
    console.log('Setting deleteRequestId to trigger processing');
    setDeleteRequestId(id);
  };

  return {
    lembretes,
    isLoading,
    isProcessing,
    handleFormSubmit,
    handleDelete,
  };
}
