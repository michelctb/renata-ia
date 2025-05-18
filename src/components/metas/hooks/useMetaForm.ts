
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from 'sonner';
import { MetaCategoria } from '@/lib/metas/types';
import { CategoryWithMeta } from '@/hooks/useCategoriesWithMetas';

// Schema for form validation - Simplificado, incluindo campos mes_referencia e ano_referencia
const formSchema = z.object({
  id: z.number().optional(),
  categoria: z.string().min(1, { message: 'Selecione uma categoria' }),
  valor_meta: z.coerce.number().positive({ message: 'O valor deve ser maior que zero' }),
  mes_referencia: z.number().optional(),
  ano_referencia: z.number().optional(),
});

export type MetaFormValues = z.infer<typeof formSchema>;

/**
 * Custom hook for managing the meta (spending goal) form.
 * Simplified to use only monthly targets.
 */
export const useMetaForm = (
  userId: string, 
  metaAtual: MetaCategoria | null,
  availableCategories: CategoryWithMeta[] = []
) => {
  // Initialize form with properly typed default values
  const form = useForm<MetaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoria: metaAtual?.categoria || '',
      valor_meta: metaAtual?.valor_meta || 0,
      mes_referencia: metaAtual?.mes_referencia,
      ano_referencia: metaAtual?.ano_referencia,
    },
  });
  
  /**
   * Prepares the form values for submission to the API.
   * Period is fixed as 'mensal' - month/year are set at the saving stage.
   */
  const prepareMetaForSubmit = (values: MetaFormValues): MetaCategoria => {
    const meta: MetaCategoria = {
      id_cliente: userId,
      categoria: values.categoria,
      valor_meta: values.valor_meta,
      periodo: 'mensal'
    };
    
    // Add ID if editing an existing meta
    if (metaAtual?.id) {
      meta.id = metaAtual.id;
    }
    
    return meta;
  };

  return {
    form,
    prepareMetaForSubmit
  };
};
