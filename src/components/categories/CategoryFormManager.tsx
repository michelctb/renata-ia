
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import CategoryForm from '../CategoryForm';

interface CategoryFormManagerProps {
  editingCategory: Category | null;
  editingMeta: MetaCategoria | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Category, metaData?: { hasMeta: boolean, valorMeta?: number }) => Promise<void>;
}

export function CategoryFormManager({
  editingCategory,
  editingMeta,
  isOpen,
  onClose,
  onSubmit
}: CategoryFormManagerProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <CategoryForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      editingCategory={editingCategory}
      meta={editingMeta}
      userId={user.id}
    />
  );
}
