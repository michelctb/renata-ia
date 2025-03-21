
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getMonth, getYear } from 'date-fns';
import { fetchCategories } from '@/lib/categories';
import { toast } from 'sonner';
import { MetaCategoria } from '@/lib/metas/types';

// Schema for form validation
const formSchema = z.object({
  id: z.number().optional(),
  categoria: z.string().min(1, { message: 'Selecione uma categoria' }),
  valor_meta: z.coerce.number().positive({ message: 'O valor deve ser maior que zero' }),
  periodo: z.enum(['mensal', 'trimestral', 'anual']),
  mes_referencia: z.number().optional(),
  ano_referencia: z.number().optional(),
});

export type MetaFormValues = z.infer<typeof formSchema>;

/**
 * Custom hook for managing the meta (spending goal) form.
 * Handles form state, validation, category loading, and data preparation.
 * 
 * @param {string} userId - The ID of the current user
 * @param {MetaCategoria | null} metaAtual - The current meta being edited, or null if creating a new one
 * @returns {Object} An object containing form controls and helper functions
 * @property {UseFormReturn} form - React Hook Form's form object with validation
 * @property {string[]} categorias - List of available spending categories
 * @property {boolean} isLoading - Whether categories are still loading
 * @property {string} periodoSelecionado - Currently selected period type
 * @property {Function} prepareMetaForSubmit - Function to prepare form values for submission
 */
export const useMetaForm = (userId: string, metaAtual: MetaCategoria | null) => {
  const [categorias, setCategorias] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load spending categories for the user
  useEffect(() => {
    const loadCategorias = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const cats = await fetchCategories(userId);
        // Filter to only include expense categories
        const gastosCategorias = cats
          .filter(cat => cat.tipo === 'saída' || cat.tipo === 'ambos')
          .map(cat => cat.nome);
        setCategorias(gastosCategorias);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar categorias de gastos');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategorias();
  }, [userId]);

  // Initialize form with properly typed default values
  const form = useForm<MetaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoria: metaAtual?.categoria || '',
      valor_meta: metaAtual?.valor_meta || 0,
      periodo: (metaAtual?.periodo as 'mensal' | 'trimestral' | 'anual') || 'mensal',
      mes_referencia: metaAtual?.mes_referencia || getMonth(new Date()) + 1,
      ano_referencia: metaAtual?.ano_referencia || getYear(new Date()),
    },
  });
  
  // Monitor changes to period type to show/hide relevant fields
  const periodoSelecionado = form.watch('periodo');
  
  /**
   * Prepares the form values for submission to the API.
   * Adds necessary fields based on the selected period type.
   * 
   * @param {MetaFormValues} values - The form values to prepare
   * @returns {MetaCategoria} The prepared meta object ready for API submission
   */
  const prepareMetaForSubmit = (values: MetaFormValues): MetaCategoria => {
    const meta: MetaCategoria = {
      id_cliente: userId,
      categoria: values.categoria,
      valor_meta: values.valor_meta,
      periodo: values.periodo
    };
    
    // Add ID if editing an existing meta
    if (metaAtual?.id) {
      meta.id = metaAtual.id;
    }
    
    // Add month and year for monthly metas
    if (values.periodo === 'mensal') {
      meta.mes_referencia = values.mes_referencia;
      meta.ano_referencia = values.ano_referencia;
    } 
    // Add only year for annual metas
    else if (values.periodo === 'anual') {
      meta.ano_referencia = values.ano_referencia;
    }
    // For quarterly metas, specific logic can be implemented here
    
    return meta;
  };

  return {
    form,
    categorias,
    isLoading,
    periodoSelecionado,
    prepareMetaForSubmit
  };
};
