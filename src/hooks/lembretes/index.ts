
import { useBasicLembretes } from './useBasicLembretes';
import { useFormSubmission } from './useFormSubmission';
import { useDeletion } from './useDeletion';
import { useFormOperations } from './useFormOperations';

interface UseLembretesProps {
  userId: string | undefined;
  isUserActive: boolean;
}

/**
 * Custom hook for managing lembretes (reminders).
 * Combines multiple smaller hooks to handle fetching, adding, updating, and deleting lembretes.
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
  // Debug the state changes 
  const { lembretes, setLembretes, isLoading, loadLembretes } = useBasicLembretes(userId);
  const { incrementFormSubmissionCount } = useFormSubmission(loadLembretes);
  const { isProcessing, handleDelete } = useDeletion(
    userId, 
    isUserActive, 
    loadLembretes, 
    setLembretes,
    lembretes
  );
  const { handleFormSubmit } = useFormOperations(
    isProcessing, 
    setLembretes, 
    incrementFormSubmissionCount
  );

  return {
    lembretes,
    isLoading,
    isProcessing,
    handleFormSubmit,
    handleDelete,
  };
}

