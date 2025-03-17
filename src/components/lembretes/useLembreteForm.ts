
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lembrete, addLembrete, updateLembrete } from '@/lib/lembretes';
import { lembreteSchema, LembreteFormValues } from './lembreteFormSchema';

interface UseLembreteFormProps {
  onSubmit: (data: Lembrete) => void;
  onClose: () => void;
  editingLembrete: Lembrete | null;
  userId: string;
}

export function useLembreteForm({ onSubmit, onClose, editingLembrete, userId }: UseLembreteFormProps) {
  const form = useForm<LembreteFormValues>({
    resolver: zodResolver(lembreteSchema),
    defaultValues: {
      lembrete: editingLembrete?.lembrete || "",
      tipo: editingLembrete?.tipo || "fixo",
      valor: editingLembrete?.valor || undefined,
      vencimento: editingLembrete?.vencimento ? new Date(editingLembrete.vencimento) : new Date(),
    },
  });

  const handleSubmit = async (values: LembreteFormValues) => {
    try {
      // Format the date to YYYY-MM-DD
      const formattedDate = values.vencimento.toISOString().split('T')[0];
      
      const lembreteData: Lembrete = {
        lembrete: values.lembrete,
        tipo: values.tipo,
        valor: values.valor,
        telefone: userId, // This is used by the trigger to find the correct client ID
        cliente: userId, // Mantido para compatibilidade
        // id_cliente field removed as it's automatically populated by database triggers
        vencimento: formattedDate,
        lembrar: formattedDate, 
        ...(editingLembrete?.id ? { id: editingLembrete.id } : {}),
      };

      console.log('Submitting lembrete data:', lembreteData);

      if (editingLembrete) {
        // For existing lembrete, update it
        const updatedLembrete = await updateLembrete(lembreteData);
        toast.success('Lembrete atualizado com sucesso');
        onSubmit(updatedLembrete || lembreteData);
      } else {
        // For new lembrete, add it
        const newLembrete = await addLembrete(lembreteData);
        toast.success('Lembrete adicionado com sucesso');
        onSubmit(newLembrete || lembreteData);
      }

      form.reset();
      onClose();
    } catch (error) {
      console.error('Error saving lembrete:', error);
      toast.error(editingLembrete ? 'Erro ao atualizar lembrete' : 'Erro ao adicionar lembrete');
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleClose
  };
}
