
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

export const useMetaForm = (userId: string, metaAtual: MetaCategoria | null) => {
  const [categorias, setCategorias] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar categorias de gastos do usuário
  useEffect(() => {
    const loadCategorias = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const cats = await fetchCategories(userId);
        // Filtrar apenas categorias de saída (gastos)
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

  // Inicializar form with properly typed default values
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
  
  // Monitorar mudanças no período para mostrar/esconder campos relevantes
  const periodoSelecionado = form.watch('periodo');
  
  const prepareMetaForSubmit = (values: MetaFormValues): MetaCategoria => {
    const meta: MetaCategoria = {
      id_cliente: userId,
      categoria: values.categoria,
      valor_meta: values.valor_meta,
      periodo: values.periodo
    };
    
    // Adicionar ID se estiver editando
    if (metaAtual?.id) {
      meta.id = metaAtual.id;
    }
    
    // Adicionar mês e ano para metas mensais
    if (values.periodo === 'mensal') {
      meta.mes_referencia = values.mes_referencia;
      meta.ano_referencia = values.ano_referencia;
    } 
    // Adicionar apenas ano para metas anuais
    else if (values.periodo === 'anual') {
      meta.ano_referencia = values.ano_referencia;
    }
    // Para trimestral, podemos implementar lógica específica aqui
    
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
