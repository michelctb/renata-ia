
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

  // Create a wrapper function to handle the return type mismatch
  const handleSubmit = async (category: Category, metaData?: { hasMeta: boolean, valorMeta?: number }) => {
    await onSubmit(category, metaData);
    // No return value needed, which matches the Promise<void> type
  };

  return (
    <CategoryForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      editingCategory={editingCategory}
      meta={editingMeta}
      userId={user.id}
    />
  );
}
