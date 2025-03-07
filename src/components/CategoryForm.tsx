
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

// Schema para validação do formulário
const formSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  tipo: z.enum(['entrada', 'saída', 'ambos']),
});

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Category) => Promise<void>;
  editingCategory: Category | null;
  userId: string;
}

export function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  userId,
}: CategoryFormProps) {
  // Inicializar formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      tipo: 'ambos',
    },
  });

  // Atualizar valores do formulário ao editar categoria
  useEffect(() => {
    if (editingCategory) {
      form.reset({
        id: editingCategory.id,
        nome: editingCategory.nome,
        tipo: editingCategory.tipo,
      });
    } else {
      form.reset({
        nome: '',
        tipo: 'ambos',
      });
    }
  }, [editingCategory, form]);

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
        padrao: false // Garantir que novas categorias nunca são padrão
      };
      
      console.log('Submitting category to backend:', category);
      await onSubmit(category);
      
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          <DialogDescription>
            {editingCategory 
              ? 'Edite os dados da categoria selecionada.'
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
                    <Input placeholder="Nome da categoria" {...field} />
                  </FormControl>
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saída">Saída</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
