
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, getMonth, getYear } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCategories } from '@/lib/categories';
import { toast } from 'sonner';
import { PERIODO_OPTIONS, MetaCategoria } from '@/lib/metas';

// Schema for form validation
const formSchema = z.object({
  id: z.number().optional(),
  categoria: z.string().min(1, { message: 'Selecione uma categoria' }),
  valor_meta: z.coerce.number().positive({ message: 'O valor deve ser maior que zero' }),
  periodo: z.enum(['mensal', 'trimestral', 'anual']),
  mes_referencia: z.number().optional(),
  ano_referencia: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MetaFormProps {
  userId: string;
  metaAtual: MetaCategoria | null;
  onSubmit: (meta: MetaCategoria) => Promise<void>;
  onCancel: () => void;
}

export function MetaForm({ userId, metaAtual, onSubmit, onCancel }: MetaFormProps) {
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
  
  // Gerar meses para seleção
  const meses = Array.from({ length: 12 }, (_, i) => {
    return {
      value: i + 1,
      label: format(new Date(2024, i, 1), 'MMMM', { locale: pt }),
    };
  });
  
  // Gerar anos para seleção (ano atual e próximos 5 anos)
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 6 }, (_, i) => {
    const ano = anoAtual + i;
    return {
      value: ano,
      label: ano.toString(),
    };
  });

  // Inicializar form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoria: metaAtual?.categoria || '',
      valor_meta: metaAtual?.valor_meta || 0,
      periodo: metaAtual?.periodo || 'mensal',
      mes_referencia: metaAtual?.mes_referencia || getMonth(new Date()) + 1,
      ano_referencia: metaAtual?.ano_referencia || getYear(new Date()),
    },
  });
  
  // Monitorar mudanças no período para mostrar/esconder campos relevantes
  const periodoSelecionado = form.watch('periodo');
  
  const handleSubmit = async (values: FormValues) => {
    try {
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
      
      await onSubmit(meta);
      form.reset();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
              <FormLabel>Valor da Meta (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
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
        
        {/* Campos específicos para período mensal */}
        {periodoSelecionado === 'mensal' && (
          <>
            <FormField
              control={form.control}
              name="mes_referencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mês</FormLabel>
                  <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {meses.map((mes) => (
                        <SelectItem key={mes.value} value={mes.value.toString()}>
                          {mes.label}
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
              name="ano_referencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {anos.map((ano) => (
                        <SelectItem key={ano.value} value={ano.value.toString()}>
                          {ano.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        {/* Campo de ano para período anual */}
        {periodoSelecionado === 'anual' && (
          <FormField
            control={form.control}
            name="ano_referencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano.value} value={ano.value.toString()}>
                        {ano.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {metaAtual ? 'Atualizar' : 'Criar'} Meta
          </Button>
        </div>
      </form>
    </Form>
  );
}
