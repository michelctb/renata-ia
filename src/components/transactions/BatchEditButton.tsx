
import { Button } from '@/components/ui/button';
import { Edit2Icon } from 'lucide-react';

interface BatchEditButtonProps {
  onClick: () => void;
  count: number;
  disabled?: boolean;
}

export function BatchEditButton({ 
  onClick, 
  count, 
  disabled = false 
}: BatchEditButtonProps) {
  if (count === 0) return null;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center space-x-2"
      size="sm"
    >
      <Edit2Icon className="h-4 w-4" />
      <span>Editar {count} selecionados</span>
    </Button>
  );
}
