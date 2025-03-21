
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

/**
 * Custom hook for managing the lembrete (reminder) form.
 * Handles form state, validation, and submission.
 * 
 * @param {Object} props - The hook's properties
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onClose - Function to close the form
 * @param {Lembrete | null} props.editingLembrete - The lembrete being edited, or null if creating a new one
 * @param {string} props.userId - The ID of the current user
 * @returns {Object} Object containing form controls and handler functions
 * @property {UseFormReturn} form - React Hook Form's form object with validation
 * @property {Function} handleSubmit - Function to handle form submission
 * @property {Function} handleClose - Function to close the form
 */
export function useLembreteForm({ onSubmit, onClose, editingLembrete, userId }: UseLembreteFormProps) {
  console.log('useLembreteForm initialized with editingLembrete:', editingLembrete);
  
  /**
   * Handles date conversion from string to Date object, adjusting for timezone.
   * Creates a date object that preserves the intended day regardless of timezone.
   * 
   * @returns {Date} The properly formatted Date object
   */
  const getInitialVencimento = () => {
    if (editingLembrete?.vencimento) {
      console.log('Initial vencimento from edit data:', editingLembrete.vencimento);
      
      // Extract year, month, and day from the date string
      const [year, month, day] = editingLembrete.vencimento.split('-').map(Number);
      
      // Create a date object, ensuring the correct day regardless of timezone
      // Using noon (12:00) to avoid issues with daylight saving time
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

  // Update form when editingLembrete changes
  useEffect(() => {
    if (editingLembrete) {
      console.log('Setting form values from editingLembrete:', editingLembrete);
      console.log('Tipo do lembrete:', editingLembrete.tipo);
      
      // Reset form with correct values
      form.reset({
        lembrete: editingLembrete.lembrete,
        tipo: editingLembrete.tipo || "fixo",
        valor: editingLembrete.valor,
        vencimento: getInitialVencimento(),
      });

      // Verify values were set correctly
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

  /**
   * Handles form submission.
   * Formats data, retrieves client information, and calls the provided onSubmit function.
   * 
   * @param {LembreteFormValues} values - The form values to submit
   */
  const handleSubmit = async (values: LembreteFormValues) => {
    try {
      console.log('Form submitted with values:', values);
      console.log('Editing mode:', editingLembrete ? true : false);
      
      // Fix timezone issue by creating a new date with UTC
      const vencimentoDate = new Date(values.vencimento);
      
      // Use year, month, and day directly to create the date string in YYYY-MM-DD format
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

  /**
   * Closes the form and resets its state.
   */
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
