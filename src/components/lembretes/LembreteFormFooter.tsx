
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface LembreteFormFooterProps {
  onCancel: () => void;
  isEditing: boolean;
}

export function LembreteFormFooter({ onCancel, isEditing }: LembreteFormFooterProps) {
  return (
    <DialogFooter className="mt-6">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEditing ? 'Atualizar' : 'Adicionar'}
      </Button>
    </DialogFooter>
  );
}
