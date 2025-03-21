
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Category } from '@/lib/categories/types';
import { MetaCategoria, PERIODO_OPTIONS } from '@/lib/metas';
import { fetchCategories } from '@/lib/categories';

// Schema para validação do formulário
const metaSchema = z.object({
  id: z.number().optional(),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  valor_meta: z.coerce.number().positive('O valor da meta deve ser maior que zero'),
  periodo: z.enum(['mensal', 'trimestral', 'anual']),
  mes_referencia: z.coerce.number().min(1).max(12).optional().nullable(),
  ano_referencia: z.coerce.number().positive().optional().nullable(),
});

type MetaFormValues = z.infer<typeof metaSchema>;

interface MetaFormProps {
  userId: string;
  metaAtual: MetaCategoria | null;
  onSubmit: (meta: MetaCategoria) => Promise<void>;
  onCancel: () => void;
}

export function MetaForm({ userId, metaAtual, onSubmit, onCancel }: MetaFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // Inicializar formulário
  const form = useForm<MetaFormValues>({
    resolver: zodResolver(metaSchema),
    defaultValues: {
      categoria: '',
      valor_meta: 0,
      periodo: 'mensal',
      mes_referencia: null,
      ano_referencia: null,
    },
  });

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      if (!userId) return;
      
      try {
        const data = await fetchCategories(userId);
        // Filtrar apenas categorias de saída
        const categoriaSaida = data.filter(
          cat => cat.tipo === 'saída' || cat.tipo === 'ambos'
        );
        setCategories(categoriaSaida);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar as categorias');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, [userId]);
  
  // Atualizar valores do formulário quando receber metaAtual
  useEffect(() => {
    if (metaAtual) {
      form.reset({
        id: metaAtual.id,
        categoria: metaAtual.categoria,
        valor_meta: metaAtual.valor_meta,
        periodo: metaAtual.periodo,
        mes_referencia: metaAtual.mes_referencia || null,
        ano_referencia: metaAtual.ano_referencia || null,
      });
    } else {
      form.reset({
        categoria: '',
        valor_meta: 0,
        periodo: 'mensal',
        mes_referencia: new Date().getMonth() + 1, // Mês atual
        ano_referencia: new Date().getFullYear(), // Ano atual
      });
    }
  }, [metaAtual, form]);

  // Handler para o período selecionado
  const handlePeriodoChange = (value: string) => {
    form.setValue('periodo', value as 'mensal' | 'trimestral' | 'anual');
    
    // Resetar campos de referência conforme o período
    if (value === 'anual') {
      form.setValue('mes_referencia', null);
      if (!form.getValues('ano_referencia')) {
        form.setValue('ano_referencia', new Date().getFullYear());
      }
    } else if (value === 'mensal') {
      if (!form.getValues('mes_referencia')) {
        form.setValue('mes_referencia', new Date().getMonth() + 1);
      }
      if (!form.getValues('ano_referencia')) {
        form.setValue('ano_referencia', new Date().getFullYear());
      }
    }
  };

  // Submit handler
  const handleSubmit = async (values: MetaFormValues) => {
    try {
      const meta: MetaCategoria = {
        ...values,
        id_cliente: userId,
      };
      
      await onSubmit(meta);
      form.reset();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast.error('Erro ao salvar meta. Tente novamente.');
    }
  };

  // Renderizar campos de mês/ano conforme o período selecionado
  const renderPeriodoFields = () => {
    const periodo = form.watch('periodo');
    
    if (periodo === 'mensal') {
      return (
        <>
          <FormField
            control={form.control}
            name="mes_referencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês de Referência</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ano_referencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano de Referência</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ano"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    } else if (periodo === 'anual') {
      return (
        <FormField
          control={form.control}
          name="ano_referencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano de Referência</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ano"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
    
    return null;
  };

  if (isLoadingCategories) {
    return <div className="flex justify-center p-4">Carregando categorias...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.nome}>
                      {category.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="valor_meta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Meta</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="periodo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Período</FormLabel>
              <Select onValueChange={handlePeriodoChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PERIODO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {renderPeriodoFields()}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {metaAtual ? 'Atualizar' : 'Adicionar'} Meta
          </Button>
        </div>
      </form>
    </Form>
  );
}
