
import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Category } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { MetaCategoria } from '@/lib/metas';
import { InfoIcon } from 'lucide-react';

// Schema para validação do formulário
const formSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  tipo: z.enum(['entrada', 'saída', 'ambos']),
  hasMeta: z.boolean().default(false),
  valorMeta: z.number().optional()
    .refine(val => !val || val > 0, {
      message: "O valor da meta deve ser maior que zero",
    }),
});

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Category, metaData?: { hasMeta: boolean, valorMeta?: number }) => Promise<void>;
  editingCategory: Category | null;
  meta?: MetaCategoria | null;
  userId: string;
}

export function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  meta,
  userId,
}: CategoryFormProps) {
  // Inicializar formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      tipo: 'ambos',
      hasMeta: false,
      valorMeta: 0,
    },
  });

  // Atualizar valores do formulário ao editar categoria
  useEffect(() => {
    form.reset({
      id: editingCategory?.id,
      nome: editingCategory?.nome || '',
      tipo: editingCategory?.tipo || 'ambos',
      hasMeta: !!meta,
      valorMeta: meta?.valor_meta || 0,
    });
  }, [editingCategory, meta, form]);

  // Verificar se é categoria padrão
  const isPadraoCategory = editingCategory?.padrao || false;

  // Gerenciar envio do formulário
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Form submitted with values:', values);
      console.log('Current userId:', userId);
      
      // Garantir que o cliente (userId) está sendo passado corretamente
      const category: Category = {
        id: values.id,
        nome: values.nome,
        tipo: values.tipo,
        cliente: userId,
        padrao: editingCategory?.padrao || false // Garantir que novas categorias nunca são padrão
      };
      
      const metaData = {
        hasMeta: values.hasMeta,
        valorMeta: values.hasMeta ? values.valorMeta : undefined
      };
      
      console.log('Submitting category to backend:', category);
      console.log('Meta data:', metaData);
      
      await onSubmit(category, metaData);
      
      toast.success(
        editingCategory 
          ? 'Categoria atualizada com sucesso!' 
          : 'Categoria adicionada com sucesso!'
      );
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao salvar a categoria: ${errorMessage}`);
    }
  };

  // Monitorar mudanças no checkbox de meta
  const hasMetaValue = form.watch("hasMeta");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          <DialogDescription>
            {editingCategory 
              ? isPadraoCategory 
                ? 'Esta é uma categoria padrão. Você só pode definir uma meta para ela.'
                : 'Edite os dados da categoria selecionada.'
              : 'Preencha os dados para criar uma nova categoria.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome da categoria" 
                      {...field} 
                      disabled={isPadraoCategory}
                      className={isPadraoCategory ? "bg-muted" : ""}
                    />
                  </FormControl>
                  {isPadraoCategory && (
                    <FormDescription className="flex items-center text-amber-600">
                      <InfoIcon className="h-4 w-4 mr-1" />
                      O nome não pode ser alterado em categorias padrão
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                    disabled={isPadraoCategory}
                  >
                    <FormControl>
                      <SelectTrigger className={isPadraoCategory ? "bg-muted" : ""}>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saída">Saída</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                  {isPadraoCategory && (
                    <FormDescription className="flex items-center text-amber-600">
                      <InfoIcon className="h-4 w-4 mr-1" />
                      O tipo não pode ser alterado em categorias padrão
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasMeta"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Definir meta de gastos</FormLabel>
                    <FormDescription>
                      Marque esta opção para definir uma meta de gastos para esta categoria
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {hasMetaValue && (
              <FormField
                control={form.control}
                name="valorMeta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Meta (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingCategory ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryForm;
