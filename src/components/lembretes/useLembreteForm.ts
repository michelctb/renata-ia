
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
      const lembreteData: Lembrete = {
        lembrete: values.lembrete,
        tipo: values.tipo,
        valor: values.valor,
        telefone: userId, // Mantido para compatibilidade
        cliente: userId, // Mantido para compatibilidade
        id_cliente: userId, // Usando o ID do usuário como id_cliente
        vencimento: values.vencimento.toISOString().split('T')[0],
        lembrar: values.vencimento.toISOString().split('T')[0], 
        ...(editingLembrete?.id ? { id: editingLembrete.id } : {}),
      };

      if (editingLembrete) {
        await updateLembrete(lembreteData);
        toast.success('Lembrete atualizado com sucesso');
      } else {
        await addLembrete(lembreteData);
        toast.success('Lembrete adicionado com sucesso');
      }

      onSubmit(lembreteData);
      form.reset();
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
