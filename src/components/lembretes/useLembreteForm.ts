
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lembrete, addLembrete, updateLembrete } from '@/lib/lembretes';
import { lembreteSchema, LembreteFormValues } from './lembreteFormSchema';
import { fetchClienteById } from '@/lib/clientes';
import { useEffect } from 'react';

interface UseLembreteFormProps {
  onSubmit: (data: Lembrete) => void;
  onClose: () => void;
  editingLembrete: Lembrete | null;
  userId: string;
}

export function useLembreteForm({ onSubmit, onClose, editingLembrete, userId }: UseLembreteFormProps) {
  console.log('useLembreteForm initialized with editingLembrete:', editingLembrete);
  
  // Garantir que as datas sejam convertidas corretamente para objetos Date, compensando o fuso horário
  const getInitialVencimento = () => {
    if (editingLembrete?.vencimento) {
      console.log('Initial vencimento from edit data:', editingLembrete.vencimento);
      
      // Extrair ano, mês e dia da string de data
      const [year, month, day] = editingLembrete.vencimento.split('-').map(Number);
      
      // Criar uma data, garantindo que o dia seja o correto independente do fuso horário
      // Usando meio-dia (12:00) para evitar problemas com horário de verão
      const dateObject = new Date(year, month - 1, day, 12, 0, 0);
      
      console.log('Created date object with correct date:', dateObject.toISOString());
      return dateObject;
    }
    return new Date();
  };

  const form = useForm<LembreteFormValues>({
    resolver: zodResolver(lembreteSchema),
    defaultValues: {
      lembrete: "",
      tipo: "fixo",
      valor: undefined,
      vencimento: new Date(),
    },
  });

  // Use useEffect para atualizar o formulário quando editingLembrete mudar
  useEffect(() => {
    if (editingLembrete) {
      console.log('Setting form values from editingLembrete:', editingLembrete);
      console.log('Tipo do lembrete:', editingLembrete.tipo);
      
      // Resetar o formulário com os valores corretos
      form.reset({
        lembrete: editingLembrete.lembrete,
        tipo: editingLembrete.tipo || "fixo",
        valor: editingLembrete.valor,
        vencimento: getInitialVencimento(),
      });

      // Verificar se os valores foram definidos corretamente
      setTimeout(() => {
        console.log('Form values after reset:', form.getValues());
      }, 0);
    } else {
      form.reset({
        lembrete: "",
        tipo: "fixo",
        valor: undefined,
        vencimento: new Date(),
      });
    }
  }, [editingLembrete, form]);

  const handleSubmit = async (values: LembreteFormValues) => {
    try {
      console.log('Form submitted with values:', values);
      console.log('Editing mode:', editingLembrete ? true : false);
      
      // Corrigir o problema de fuso horário criando uma nova data com UTC
      const vencimentoDate = new Date(values.vencimento);
      
      // Usar o ano, mês e dia diretamente para criar a string de data no formato YYYY-MM-DD
      const formattedDate = `${vencimentoDate.getFullYear()}-${
        String(vencimentoDate.getMonth() + 1).padStart(2, '0')
      }-${
        String(vencimentoDate.getDate()).padStart(2, '0')
      }`;
      
      console.log('Original date:', values.vencimento);
      console.log('Formatted date for storage:', formattedDate);
      
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
        console.log('Setting ID for update:', lembreteData.id);
      }

      console.log('Submitting lembrete data:', lembreteData);

      if (editingLembrete) {
        // For existing lembrete, update it
        const updatedLembrete = await updateLembrete(lembreteData);
        toast.success('Lembrete atualizado com sucesso');
        
        console.log('Update successful, updated lembrete:', updatedLembrete);
        
        // Clean up before calling onSubmit
        form.reset();
        
        // Then call onSubmit with the updated data
        onSubmit(updatedLembrete || lembreteData);
        
        // And finally close the dialog
        onClose();
      } else {
        // For new lembrete, add it
        const newLembrete = await addLembrete(lembreteData);
        toast.success('Lembrete adicionado com sucesso');
        
        // Clean up before calling onSubmit
        form.reset();
        
        // Then call onSubmit with the new data
        onSubmit(newLembrete || lembreteData);
        
        // And finally close the dialog
        onClose();
      }
    } catch (error) {
      console.error('Error saving lembrete:', error);
      toast.error(editingLembrete ? 'Erro ao atualizar lembrete' : 'Erro ao adicionar lembrete');
    }
  };

  const handleClose = () => {
    console.log('Closing form and resetting');
    form.reset();
    onClose();
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleClose
  };
}
