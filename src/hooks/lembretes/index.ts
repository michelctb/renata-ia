
import { useBasicLembretes } from './useBasicLembretes';
import { useFormSubmission } from './useFormSubmission';
import { useDeletion } from './useDeletion';
import { useFormOperations } from './useFormOperations';
import { Lembrete } from '@/lib/lembretes';
import { useState } from 'react';

interface UseLembretesProps {
  userId: string | undefined;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

/**
 * Custom hook for managing lembretes (reminders).
 * Combines multiple smaller hooks to handle fetching, adding, updating, and deleting lembretes.
 */
export function useLembretes({ userId, isUserActive, viewMode = 'user' }: UseLembretesProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lembreteToDelete, setLembreteToDelete] = useState<number | null>(null);
  
  // Load lembretes
  const { lembretes, setLembretes, isLoading, loadLembretes } = useBasicLembretes(userId);
  
  // Form operations
  const { isProcessing, handleAddNew, handleEdit, handleCloseForm, handleSubmitForm } = 
    useFormOperations({
      setIsFormOpen,
      setEditingLembrete,
      refetchLembretes: loadLembretes,
      isUserActive,
      viewMode
    });
  
  // Handle delete request
  const handleDeleteRequest = (id: number) => {
    if (!isUserActive) {
      return;
    }
    
    if (viewMode === 'consultor') {
      return;
    }
    
    setLembreteToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  // Delete handling
  const { handleDelete } = useDeletion();
  
  // Confirm delete
  const handleConfirmDelete = async () => {
    if (lembreteToDelete) {
      await handleDelete(lembreteToDelete);
      setDeleteDialogOpen(false);
      setLembreteToDelete(null);
      loadLembretes();
    }
  };

  return {
    lembretes,
    isLoading,
    isProcessing,
    isFormOpen,
    editingLembrete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    lembreteToDelete,
    handleAddNew,
    handleEdit,
    handleCloseForm,
    handleSubmitForm,
    handleDeleteRequest,
    handleConfirmDelete
  };
}
