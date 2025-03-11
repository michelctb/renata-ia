
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Transaction } from '@/lib/supabase';
import { Category, fetchCategories } from '@/lib/categories';
import { toast } from 'sonner';

// Schema for form validation
const formSchema = z.object({
  id: z.number().optional(),
  operação: z.enum(['entrada', 'saída']),
  descrição: z.string().min(3, {
    message: 'A descrição deve ter pelo menos 3 caracteres.',
  }),
  categoria: z.string().min(1, {
    message: 'Selecione uma categoria.',
  }),
  valor: z.coerce.number().positive({
    message: 'O valor deve ser maior que zero.',
  }),
  data: z.date({
    required_error: 'Selecione uma data.',
  }),
});

export type TransactionFormValues = z.infer<typeof formSchema>;

export function useTransactionForm(
  userId: string,
  editingTransaction: Transaction | null,
  onSubmit: (data: Transaction) => Promise<void>,
  onClose: () => void
) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // Initialize form
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operação: 'entrada',
      descrição: '',
      categoria: '',
      valor: 0,
      data: new Date(),
    },
  });

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      if (!userId) return;
      
      try {
        console.log('Loading categories for transaction form, userId:', userId);
        const data = await fetchCategories(userId);
        console.log('Categories loaded:', data);
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar as categorias.');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, [userId]);
  
  // Update form values when editing transaction
  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        id: editingTransaction.id,
        operação: editingTransaction.operação,
        descrição: editingTransaction.descrição,
        categoria: editingTransaction.categoria,
        valor: editingTransaction.valor,
        data: new Date(editingTransaction.data),
      });
    } else {
      form.reset({
        operação: 'entrada',
        descrição: '',
        categoria: '',
        valor: 0,
        data: new Date(),
      });
    }
  }, [editingTransaction, form]);

  // Handle form submission
  const handleSubmit = async (values: TransactionFormValues) => {
    try {
      console.log('Transaction form submitted with values:', values);
      console.log('Current userId:', userId);
      
      // Garantir que a data seja formatada corretamente
      const formattedDate = values.data.toISOString().split('T')[0]; // formato yyyy-MM-dd
      
      const transaction: Transaction = {
        id: values.id,
        cliente: userId,
        data: formattedDate,
        operação: values.operação,
        descrição: values.descrição,
        categoria: values.categoria,
        valor: values.valor,
      };
      
      console.log('Transaction object to submit:', transaction);
      await onSubmit(transaction);
      
      form.reset();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error('Erro ao salvar a transação. Tente novamente.');
      throw error; // Propagar o erro para que o componente pai possa tratá-lo
    }
  };

  // Filtrar categorias baseado no tipo de operação selecionado
  const filteredCategories = categories.filter(
    cat => cat.tipo === 'ambos' || cat.tipo === form.watch('operação')
  );

  return {
    form,
    categories,
    filteredCategories,
    isLoadingCategories,
    handleSubmit,
    onClose
  };
}
