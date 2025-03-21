
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface CategoryActionsProps {
  onAddNew: () => void;
  isActive: boolean;
  isProcessing?: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function CategoryActions({ 
  onAddNew, 
  isActive,
  isProcessing = false,
  viewMode = 'user'
}: CategoryActionsProps) {
  return (
    <Button 
      onClick={onAddNew} 
      disabled={!isActive || isProcessing || viewMode === 'consultor'}
      className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
    >
      <PlusIcon className="h-4 w-4 mr-1" />
      {viewMode === 'consultor' ? 'Modo Visualização' : 'Nova Categoria'}
    </Button>
  );
}
