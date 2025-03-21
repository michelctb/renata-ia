
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MetasEmptyStateProps {
  onAddMeta: () => void;
}

export function MetasEmptyState({ onAddMeta }: MetasEmptyStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">
        Você ainda não definiu nenhuma meta de gastos.
      </p>
      <Button onClick={onAddMeta} className="flex items-center gap-1">
        <Plus className="h-4 w-4" />
        Adicionar Meta
      </Button>
    </div>
  );
}
