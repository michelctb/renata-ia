
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CategoryFormContent } from './categories/form/CategoryFormContent';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            {editingCategory 
              ? editingCategory.padrao 
                ? 'Esta é uma categoria padrão. Você só pode definir uma meta para ela.'
                : 'Edite os dados da categoria selecionada.'
              : 'Preencha os dados para criar uma nova categoria.'}
          </DialogDescription>
        </DialogHeader>
        
        <CategoryFormContent
          onSubmit={onSubmit}
          onClose={onClose}
          editingCategory={editingCategory}
          meta={meta}
          userId={userId}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CategoryForm;
