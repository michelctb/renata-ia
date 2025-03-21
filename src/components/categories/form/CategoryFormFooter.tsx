
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface CategoryFormFooterProps {
  onClose: () => void;
  isEditing: boolean;
}

export function CategoryFormFooter({ onClose, isEditing }: CategoryFormFooterProps) {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEditing ? 'Atualizar' : 'Adicionar'}
      </Button>
    </DialogFooter>
  );
}
