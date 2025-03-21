
import { useState } from 'react';
import { toast } from 'sonner';
import { LembreteFormValues } from '@/components/lembretes/lembreteFormSchema';
import { useFormSubmission } from './useFormSubmission';

interface FormOperationsProps {
  setIsFormOpen: (open: boolean) => void;
  setEditingLembrete: (lembrete: LembreteFormValues | null) => void;
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
  const { incrementFormSubmissionCount } = useFormSubmission();
  
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
  const handleEdit = (lembrete: LembreteFormValues) => {
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
  const handleSubmitForm = async (formData: LembreteFormValues) => {
    setIsProcessing(true);
    
    try {
      // Here we would call an API to save the lembrete
      // But for now, we'll just simulate success
      
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
