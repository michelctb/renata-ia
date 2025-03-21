
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MetasActionsButtonProps {
  onAddMeta: () => void;
}

export function MetasActionsButton({ onAddMeta }: MetasActionsButtonProps) {
  return (
    <div className="flex justify-end">
      <Button onClick={onAddMeta} className="flex items-center gap-1">
        <Plus className="h-4 w-4" />
        Nova Meta
      </Button>
    </div>
  );
}
