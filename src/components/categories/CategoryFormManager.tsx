
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import CategoryForm from '@/components/CategoryForm';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryFormValues } from './categoryFormSchema';

export interface CategoryFormManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CategoryFormValues) => Promise<void>;
  editingCategory: CategoryFormValues | null;
}

export function CategoryFormManager({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
}: CategoryFormManagerProps) {
  const { user } = useAuth();
  const userId = user?.id || '';

  const handleSubmit = async (
    category: Category, 
    metaData?: { hasMeta: boolean, valorMeta?: number }
  ) => {
    // Convert the category to the expected form data
    const formData: CategoryFormValues = {
      id: category.id,
      nome: category.nome,
      tipo: category.tipo as 'entrada' | 'saída' | 'ambos',
      hasMeta: metaData?.hasMeta || false,
      valorMeta: metaData?.valorMeta
    };
    
    console.log("Dados do formulário antes de enviar:", formData);
    
    // Call the provided onSubmit function
    await onSubmit(formData);
  };

  return (
    <CategoryForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      editingCategory={editingCategory ? {
        id: editingCategory.id,
        nome: editingCategory.nome,
        tipo: editingCategory.tipo,
        cliente: userId,
        padrao: false
      } as Category : null}
      meta={editingCategory?.hasMeta ? {
        id: undefined,
        categoria: editingCategory.nome,
        valor_meta: editingCategory.valorMeta || 0,
        id_cliente: userId,
        periodo: 'mensal'
      } as MetaCategoria : null}
      userId={userId}
    />
  );
}
