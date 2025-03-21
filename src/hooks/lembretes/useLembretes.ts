
import { useBasicLembretes } from './useBasicLembretes';
import { useDeletion } from './useDeletion';
import { useFormSubmission } from './useFormSubmission';
import { useFormOperations } from './useFormOperations';

/**
 * Combined hook for lembretes management
 * Combines functionality from all lembretes-related hooks
 * 
 * @param {string | undefined} userId - The ID of the current user
 * @returns {Object} Combined lembretes functionality
 */
export function useLembretes(userId: string | undefined) {
  // Get basic lembretes data and operations
  const { 
    lembretes, 
    setLembretes,
    isLoading, 
    loadLembretes,
    refetchLembretes
  } = useBasicLembretes(userId);
  
  // Get deletion functionality
  const { 
    isProcessing: isDeleting,
    handleDelete 
  } = useDeletion();
  
  // Get form submission tracking
  const {
    formSubmissionCount,
    incrementFormSubmissionCount
  } = useFormSubmission();
  
  // Get form operations
  const formOps = useFormOperations({ 
    userId: userId || '', 
    onSuccess: refetchLembretes
  });
  
  return {
    // Data
    lembretes,
    setLembretes,
    isLoading,
    isDeleting: isDeleting || formOps.isProcessing,
    
    // Actions
    loadLembretes,
    refetchLembretes,
    handleDelete,
    
    // Form
    formSubmissionCount,
    incrementFormSubmissionCount,
    handleSubmitForm: formOps.handleSubmitForm
  };
}
