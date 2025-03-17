
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lembrete, addLembrete, updateLembrete } from '@/lib/lembretes';
import { lembreteSchema, LembreteFormValues } from './lembreteFormSchema';
import { fetchClienteById } from '@/lib/clientes';

interface UseLembreteFormProps {
  onSubmit: (data: Lembrete) => void;
  onClose: () => void;
  editingLembrete: Lembrete | null;
  userId: string;
}

export function useLembreteForm({ onSubmit, onClose, editingLembrete, userId }: UseLembreteFormProps) {
  // Garantir que as datas sejam convertidas corretamente para objetos Date
  const getInitialVencimento = () => {
    if (editingLembrete?.vencimento) {
      // Garantir que temos um objeto Date válido
      const date = new Date(editingLembrete.vencimento);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };

  const form = useForm<LembreteFormValues>({
    resolver: zodResolver(lembreteSchema),
    defaultValues: {
      lembrete: editingLembrete?.lembrete || "",
      tipo: editingLembrete?.tipo || "fixo",
      valor: editingLembrete?.valor || undefined,
      vencimento: getInitialVencimento(),
    },
  });

  const handleSubmit = async (values: LembreteFormValues) => {
    try {
      // Format the date to YYYY-MM-DD
      const formattedDate = values.vencimento.toISOString().split('T')[0];
      
      // Get client details to set cliente (name) and telefone
      let clienteData;
      try {
        clienteData = await fetchClienteById(userId);
        console.log('Client data fetched:', clienteData);
      } catch (error) {
        console.error('Error fetching client data:', error);
        // Continue with the available data if client fetch fails
      }
      
      const lembreteData: Lembrete = {
        lembrete: values.lembrete,
        tipo: values.tipo,
        valor: values.valor,
        telefone: clienteData?.telefone || userId, // Telephone from client record
        cliente: clienteData?.nome || userId, // Name from client record
        vencimento: formattedDate,
        lembrar: formattedDate, // Same as vencimento
        id_cliente: userId // Set the user ID directly
      };

      // Only include id for updates
      if (editingLembrete?.id) {
        lembreteData.id = editingLembrete.id;
      }

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
