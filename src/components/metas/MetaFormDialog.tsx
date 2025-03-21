
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { MetaForm } from './MetaForm';
import { MetaCategoria } from '@/lib/metas';
import { CategoryWithMeta } from '@/hooks/useCategoriesWithMetas';

interface MetaFormDialogProps {
  userId: string;
  isOpen: boolean;
  metaAtual: MetaCategoria | null;
  onOpenChange: (open: boolean) => void;
  onSave: (meta: MetaCategoria) => Promise<void>;
  availableCategories: CategoryWithMeta[];
}

export function MetaFormDialog({
  userId,
  isOpen,
  metaAtual,
  onOpenChange,
  onSave,
  availableCategories,
}: MetaFormDialogProps) {
  const handleSave = async (meta: MetaCategoria) => {
    await onSave(meta);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {metaAtual ? 'Editar Meta' : 'Nova Meta'}
          </DialogTitle>
        </DialogHeader>
        
        <MetaForm
          userId={userId}
          metaAtual={metaAtual}
          onSubmit={handleSave}
          onCancel={handleCancel}
          availableCategories={availableCategories}
        />
      </DialogContent>
    </Dialog>
  );
}
