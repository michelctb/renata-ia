
import { useState, useEffect } from 'react';
import { Lembrete } from '@/lib/lembretes';
import LembreteForm from './LembreteForm';

interface LembreteFormManagerProps {
  isUserActive: boolean;
  userId: string;
  onSubmit: (data: Lembrete) => void;
}

export function LembreteFormManager({ isUserActive, userId, onSubmit }: LembreteFormManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);

  const handleAddNew = () => {
    // Block inactive users from adding lembretes
    if (!isUserActive) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar lembretes.');
      return;
    }
    
    console.log('Adding new lembrete, clearing editing state');
    setEditingLembrete(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lembrete: Lembrete) => {
    // Block inactive users from editing lembretes
    if (!isUserActive) {
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

  return {
    isFormOpen,
    editingLembrete,
    handleAddNew,
    handleEdit,
    handleFormClose,
    FormComponent: (
      <LembreteForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={onSubmit}
        editingLembrete={editingLembrete}
        userId={userId || ''}
      />
    )
  };
}
