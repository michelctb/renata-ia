import { useAuth } from '@/contexts/AuthContext';
import { Lembrete } from '@/lib/lembretes';
import { toast } from 'sonner';
import LembretesList from '@/components/lembretes/LembretesList';
import { useLembretes } from '@/hooks/lembretes';
import { LembretesHeader } from '@/components/lembretes/LembretesHeader';
import { useState } from 'react';
import LembreteForm from '@/components/lembretes/LembreteForm';

const LembretesTab = () => {
  const { user, isUserActive } = useAuth();
  const { lembretes, isLoading, isProcessing, handleFormSubmit, handleDelete } = useLembretes({
    userId: user?.id,
    isUserActive: isUserActive(),
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);

  const handleAddNew = () => {
    // Block inactive users from adding lembretes
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar lembretes.');
      return;
    }
    
    console.log('Adding new lembrete, clearing editing state');
    setEditingLembrete(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lembrete: Lembrete) => {
    // Block inactive users from editing lembretes
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode editar lembretes.');
      return;
    }
    
    console.log('Editing lembrete with ID:', lembrete.id);
    console.log('Editing lembrete:', lembrete);
    
    // Make sure we create a deep copy of the object
    const lembreteCopy = JSON.parse(JSON.stringify(lembrete));
    setEditingLembrete(lembreteCopy);
    
    // Set form open after editing state is set
    setTimeout(() => {
      setIsFormOpen(true);
    }, 0);
  };

  const handleFormClose = () => {
    console.log('Form closed, cleaning up state');
    setIsFormOpen(false);
    // Clear the editing lembrete after a short delay to avoid timing issues
    setTimeout(() => {
      setEditingLembrete(null);
    }, 100);
  };

  if (isLoading && lembretes.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse text-lg">Carregando lembretes...</div>
      </div>
    );
  }

  return (
    <div>
      <LembretesHeader 
        onAddNew={handleAddNew} 
        isUserActive={isUserActive()} 
        isProcessing={isProcessing}
      />

      <LembretesList 
        lembretes={lembretes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isUserActive={isUserActive()}
        isProcessing={isProcessing}
      />

      <LembreteForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingLembrete={editingLembrete}
        userId={user?.id || ''}
      />
    </div>
  );
};

export default LembretesTab;
