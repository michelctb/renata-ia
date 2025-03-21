
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lembrete } from '@/lib/lembretes';
import { lembreteSchema } from '@/components/lembretes/lembreteFormSchema';
import { z } from 'zod';
import { useFormSubmission } from './useFormSubmission';

type LembreteSchema = z.infer<typeof lembreteSchema>;

interface UseFormOperationsProps {
  userId: string;
  onSuccess?: () => void;
}

export function useFormOperations({ userId, onSuccess }: UseFormOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { formSubmissionCount, incrementFormSubmissionCount } = useFormSubmission();
  
  // Handle form submission
  const handleSubmitForm = async (formData: LembreteSchema) => {
    if (!userId) {
      toast.error('Usuário não encontrado');
      return false;
    }
    
    setIsProcessing(true);
    try {
      // Submit the form data
      incrementFormSubmissionCount();
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
      toast.error('Erro ao salvar lembrete. Tente novamente.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    handleSubmitForm,
    formSubmissionCount
  };
}
