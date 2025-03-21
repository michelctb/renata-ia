
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteLembrete } from '@/lib/lembretes';

/**
 * Custom hook for handling deletion of lembretes (reminders).
 */
export function useDeletion() {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handles the deletion of a lembrete.
   * 
   * @param {number} id - The ID of the lembrete to delete
   * @returns {Promise<void>}
   */
  const handleDelete = async (id: number) => {
    if (!id) {
      console.error('No lembrete ID provided for deletion');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log(`Deleting lembrete with ID: ${id}`);
      await deleteLembrete(id);
      toast.success('Lembrete excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting lembrete:', error);
      toast.error('Erro ao excluir lembrete. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleDelete
  };
}
