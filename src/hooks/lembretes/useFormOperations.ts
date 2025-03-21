
import { useCallback } from 'react';
import { Lembrete } from '@/lib/lembretes';
import { toast } from 'sonner';

/**
 * Hook to handle form submission operations.
 * Manages adding and updating lembretes through form submission.
 * 
 * @param {boolean} isProcessing - Whether an operation is in progress
 * @param {Function} setLembretes - Function to update lembretes state
 * @param {Function} incrementFormSubmissionCount - Function to trigger a reload
 * @returns {Object} Object containing form operation handlers
 * @property {Function} handleFormSubmit - Function to handle form submission
 */
export function useFormOperations(
  isProcessing: boolean,
  setLembretes: React.Dispatch<React.SetStateAction<Lembrete[]>>,
  incrementFormSubmissionCount: () => void
) {
  /**
   * Handles form submission for adding or updating a lembrete.
   * Updates local state optimistically, then triggers a reload.
   * 
   * @param {Lembrete} data - The lembrete data to submit
   */
  const handleFormSubmit = useCallback(async (data: Lembrete) => {
    if (isProcessing) {
      console.log('Already processing a submission, ignoring');
      return;
    }
    
    try {
      console.log('Starting form submission processing');
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
      incrementFormSubmissionCount();
      
    } catch (error) {
      console.error('Error updating lembretes list:', error);
      toast.error('Erro ao atualizar a lista de lembretes.');
    }
  }, [isProcessing, setLembretes, incrementFormSubmissionCount]);

  return {
    handleFormSubmit
  };
}
