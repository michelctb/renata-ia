
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import { categoryFormSchema, CategoryFormValues } from '../categoryFormSchema';
import { CategoryNameField } from './CategoryNameField';
import { CategoryTypeField } from './CategoryTypeField';
import { CategoryMetaFields } from './CategoryMetaFields';
import { CategoryFormFooter } from './CategoryFormFooter';

interface CategoryFormContentProps {
  onSubmit: (data: Category, metaData?: { hasMeta: boolean, valorMeta?: number }) => Promise<void>;
  onClose: () => void;
  editingCategory: Category | null;
  meta?: MetaCategoria | null;
  userId: string;
}

export function CategoryFormContent({
  onSubmit,
  onClose,
  editingCategory,
  meta,
  userId,
}: CategoryFormContentProps) {
  // Initialize form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: '',
      tipo: 'ambos',
      hasMeta: false,
      valorMeta: 0,
    },
  });

  // Update form values when editing a category
  useEffect(() => {
    form.reset({
      id: editingCategory?.id,
      nome: editingCategory?.nome || '',
      tipo: editingCategory?.tipo || 'ambos',
      hasMeta: !!meta,
      valorMeta: meta?.valor_meta || 0,
    });
  }, [editingCategory, meta, form]);

  // Check if it's a default category
  const isPadraoCategory = editingCategory?.padrao || false;

  // Handle form submission
  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      console.log('Form submitted with values:', values);
      console.log('Current userId:', userId);
      
      // Ensure that the client (userId) is passed correctly
      const category: Category = {
        id: values.id,
        nome: values.nome,
        tipo: values.tipo,
        cliente: userId,
        padrao: editingCategory?.padrao || false // Ensure new categories are never default
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">
        <CategoryNameField 
          control={form.control} 
          isPadraoCategory={isPadraoCategory} 
        />
        
        <CategoryTypeField 
          control={form.control} 
          isPadraoCategory={isPadraoCategory} 
        />
        
        <CategoryMetaFields control={form.control} />
        
        <CategoryFormFooter 
          onClose={onClose} 
          isEditing={!!editingCategory} 
        />
      </form>
    </Form>
  );
}
