
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lembrete } from '@/lib/lembretes';
import { useBasicLembretes } from './useBasicLembretes';
import { useFormOperations } from './useFormOperations';
import { useDeletion } from './useDeletion';
import { lembreteSchema } from '@/components/lembretes/lembreteFormSchema';
import { z } from 'zod';

type LembreteSchema = z.infer<typeof lembreteSchema>;

export function useLembretes(clientId?: string) {
  const { user } = useAuth();
  const userId = clientId || user?.id;
  
  // State for form management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);
  
  // Get basic lembretes data
  const { 
    lembretes, 
    setLembretes, 
    isLoading, 
    loadLembretes 
  } = useBasicLembretes(userId);
  
  // Get form operations
  const { 
    isProcessing: isFormProcessing, 
    handleSubmitForm 
  } = useFormOperations({ 
    userId: userId || '',
    onSuccess: loadLembretes
  });
  
  // Get deletion operations
  const { 
    isProcessing: isDeleteProcessing, 
    handleDelete 
  } = useDeletion({ 
    setLembretes, 
    onSuccess: loadLembretes 
  });
  
  // Open form for new lembrete
  const handleAddNew = () => {
    setEditingLembrete(null);
    setIsFormOpen(true);
  };
  
  // Open form to edit lembrete
  const handleEdit = (lembrete: Lembrete) => {
    setEditingLembrete({...lembrete});
    setIsFormOpen(true);
  };
  
  // Close form
  const handleFormClose = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingLembrete(null);
    }, 100);
  };
  
  return {
    // Basic data
    lembretes,
    setLembretes,
    isLoading,
    loadLembretes,
    
    // Form state
    isFormOpen,
    editingLembrete,
    handleAddNew,
    handleEdit,
    handleFormClose,
    handleFormSubmit: handleSubmitForm,
    isFormProcessing,
    
    // Delete operations
    handleDelete,
    isDeleteProcessing,
    
    // Added fields for LembretesTab.tsx
    lembreteToDelete: null,
    deleteDialogOpen: false,
    setDeleteDialogOpen: () => {},
    handleDeleteRequest: handleDelete,
    handleConfirmDelete: handleDelete,
    refetchLembretes: loadLembretes
  };
}
