
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LembretesHeader } from '@/components/lembretes/LembretesHeader';
import { LembretesList } from '@/components/lembretes/LembretesList';
import { LembreteFormManager } from '@/components/lembretes/LembreteFormManager';
import { DeleteLembreteDialog } from '@/components/lembretes/DeleteLembreteDialog';
import { LembreteSchema } from '@/components/lembretes/lembreteFormSchema';
import { useBasicLembretes } from '@/hooks/lembretes/useBasicLembretes';
import { useDeletion } from '@/hooks/lembretes/useDeletion';
import { useFormOperations } from '@/hooks/lembretes/useFormOperations';

type LembretesTabProps = {
  clientId?: string;
  viewMode?: 'user' | 'admin' | 'consultor';
};

const LembretesTab = ({ clientId, viewMode = 'user' }: LembretesTabProps) => {
  const { user, isUserActive } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<LembreteSchema | null>(null);
  
  // Use client ID if in consultor view mode
  const userId = viewMode === 'consultor' && clientId ? clientId : user?.id;
  
  // Load lembretes data
  const { 
    lembretes, 
    isLoading, 
    refetchLembretes
  } = useBasicLembretes(userId);
  
  // Deletion handling
  const {
    lembreteToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteRequest,
    handleConfirmDelete
  } = useDeletion({ onSuccess: refetchLembretes });
  
  // Form operations
  const {
    handleAddNew,
    handleEdit,
    handleCloseForm,
    handleSubmitForm,
    isProcessing
  } = useFormOperations({
    setIsFormOpen,
    setEditingLembrete,
    refetchLembretes,
    isUserActive: isUserActive(),
    viewMode
  });
  
  return (
    <div className="space-y-6">
      <LembretesHeader 
        onAddNew={handleAddNew} 
        isUserActive={isUserActive()} 
        isProcessing={isProcessing}
      />
      
      <LembretesList 
        lembretes={lembretes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        isUserActive={isUserActive()}
        viewMode={viewMode}
      />
      
      <LembreteFormManager
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        editingLembrete={editingLembrete}
        userId={userId}
      />
      
      <DeleteLembreteDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        lembreteId={lembreteToDelete}
      />
    </div>
  );
};

export default LembretesTab;
