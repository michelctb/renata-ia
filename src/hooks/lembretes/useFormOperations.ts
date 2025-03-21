
import { useState } from 'react';
import { toast } from 'sonner';
import { LembreteSchema } from '@/components/lembretes/lembreteFormSchema';
import { useFormSubmission } from './useFormSubmission';

interface FormOperationsProps {
  setIsFormOpen: (open: boolean) => void;
  setEditingLembrete: (lembrete: LembreteSchema | null) => void;
  refetchLembretes: () => void;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export const useFormOperations = ({
  setIsFormOpen,
  setEditingLembrete,
  refetchLembretes,
  isUserActive,
  viewMode = 'user'
}: FormOperationsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { submitLembrete } = useFormSubmission();
  
  // Handler for opening form to add a new lembrete
  const handleAddNew = () => {
    if (!isUserActive) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar lembretes.');
      return;
    }
    
    if (viewMode === 'consultor') {
      toast.error('Você não tem permissão para adicionar lembretes para este cliente.');
      return;
    }
    
    setEditingLembrete(null);
    setIsFormOpen(true);
  };
  
  // Handler for opening form to edit an existing lembrete
  const handleEdit = (lembrete: LembreteSchema) => {
    if (!isUserActive) {
      toast.error('Sua assinatura está inativa. Você não pode editar lembretes.');
      return;
    }
    
    if (viewMode === 'consultor') {
      toast.error('Você não tem permissão para editar lembretes deste cliente.');
      return;
    }
    
    setEditingLembrete(lembrete);
    setIsFormOpen(true);
  };
  
  // Handler for closing the form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    
    // Clear editing state after a brief delay to prevent UI flicker
    setTimeout(() => {
      setEditingLembrete(null);
    }, 100);
  };
  
  // Handler for submitting the form
  const handleSubmitForm = async (formData: LembreteSchema) => {
    setIsProcessing(true);
    
    try {
      await submitLembrete(formData);
      
      // Refetch lembretes to update the list
      refetchLembretes();
      
      // Close the form
      setIsFormOpen(false);
      
      // Show success message
      toast.success(
        formData.id ? 'Lembrete atualizado com sucesso!' : 'Lembrete adicionado com sucesso!'
      );
    } catch (error) {
      console.error('Error submitting lembrete:', error);
      toast.error('Erro ao salvar lembrete. Tente novamente.');
    } finally {
      setIsProcessing(false);
      
      // Clear editing state after a brief delay
      setTimeout(() => {
        setEditingLembrete(null);
      }, 100);
    }
  };
  
  return {
    isProcessing,
    handleAddNew,
    handleEdit,
    handleCloseForm,
    handleSubmitForm
  };
};
