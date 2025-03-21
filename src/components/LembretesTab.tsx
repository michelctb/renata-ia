
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LembretesHeader } from '@/components/lembretes/LembretesHeader';
import LembretesList from '@/components/lembretes/LembretesList';
import { LembreteForm } from '@/components/lembretes/LembreteForm';
import { DeleteLembreteDialog } from '@/components/lembretes/DeleteLembreteDialog';
import { LembreteFormValues } from '@/components/lembretes/lembreteFormSchema';
import { useBasicLembretes } from '@/hooks/lembretes/useBasicLembretes';
import { useDeletion } from '@/hooks/lembretes/useDeletion';
import { Lembrete } from '@/lib/lembretes';

type LembretesTabProps = {
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
};

const LembretesTab = ({ clientId, viewMode = 'user' }: LembretesTabProps) => {
  const { user, isUserActive } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lembreteToDelete, setLembreteToDelete] = useState<number | null>(null);
  
  // Use client ID if in consultor view mode
  const userId = viewMode === 'consultor' && clientId ? clientId : user?.id;
  
  // Load lembretes data
  const { 
    lembretes, 
    isLoading,
    loadLembretes
  } = useBasicLembretes(userId);
  
  // Deletion handling
  const { handleDelete } = useDeletion();
  
  // Handle adding a new lembrete
  const handleAddNew = () => {
    if (!isUserActive()) {
      return;
    }
    
    if (viewMode === 'consultor') {
      return;
    }
    
    setEditingLembrete(null);
    setIsFormOpen(true);
  };
  
  // Handle editing a lembrete
  const handleEdit = (lembrete: Lembrete) => {
    if (!isUserActive()) {
      return;
    }
    
    if (viewMode === 'consultor') {
      return;
    }
    
    setEditingLembrete(lembrete);
    setIsFormOpen(true);
  };
  
  // Handle closing the form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingLembrete(null);
    }, 100);
  };
  
  // Handle form submission
  const handleSubmitForm = async (formData: Lembrete) => {
    // Handle form submission logic
    loadLembretes();
    
    // Close form
    setIsFormOpen(false);
    
    // Clear editing state
    setTimeout(() => {
      setEditingLembrete(null);
    }, 100);
  };
  
  // Handle delete request
  const handleDeleteRequest = (id: number) => {
    if (!isUserActive()) {
      return;
    }
    
    if (viewMode === 'consultor') {
      return;
    }
    
    setLembreteToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (lembreteToDelete) {
      await handleDelete(lembreteToDelete);
      loadLembretes();
      setDeleteDialogOpen(false);
      setLembreteToDelete(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <LembretesHeader 
        onAddNew={handleAddNew} 
        isUserActive={isUserActive()} 
        viewMode={viewMode}
      />
      
      <LembretesList 
        lembretes={lembretes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        isUserActive={isUserActive()}
        viewMode={viewMode}
      />
      
      <LembreteForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        editingLembrete={editingLembrete}
        userId={userId || ''}
      />
      
      <DeleteLembreteDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        lembreteId={lembreteToDelete}
      />
    </div>
  );
};

export default LembretesTab;
