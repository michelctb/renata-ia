
import { useState } from 'react';
import { MetaCategoria } from '@/lib/metas/types';
import { MetaItem } from './components/MetaItem';
import { DeleteMetaDialog } from './DeleteMetaDialog';
import { CategoryWithMeta } from '@/hooks/useCategoriesWithMetas';

interface MetasListProps {
  metas: MetaCategoria[];
  onEditClick: (meta: MetaCategoria) => void;
  onDeleteClick: (id: number) => Promise<void>;
  categoriesWithMetas: CategoryWithMeta[];
}

export function MetasList({ metas, onEditClick, onDeleteClick, categoriesWithMetas }: MetasListProps) {
  const [metaToDelete, setMetaToDelete] = useState<MetaCategoria | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = (meta: MetaCategoria) => {
    setMetaToDelete(meta);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (metaToDelete?.id) {
      await onDeleteClick(metaToDelete.id);
      setShowDeleteDialog(false);
      setMetaToDelete(null);
    }
  };
  
  // Get categories that don't have metas yet
  const categoriesWithoutMetas = categoriesWithMetas
    .filter(item => !item.hasMeta)
    .map(item => item.category.nome);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {metas.map((meta) => (
          <MetaItem 
            key={meta.id} 
            meta={meta} 
            onEditClick={() => onEditClick(meta)}
            onDeleteClick={() => handleDelete(meta)}
          />
        ))}
      </div>
      
      {categoriesWithoutMetas.length > 0 && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Categorias sem metas</h3>
          <div className="flex flex-wrap gap-2">
            {categoriesWithoutMetas.map(category => (
              <span key={category} className="px-2 py-1 bg-background rounded-md text-sm">
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      <DeleteMetaDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        metaName={metaToDelete?.categoria || ''}
      />
    </div>
  );
}
