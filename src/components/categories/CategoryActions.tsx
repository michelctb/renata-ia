
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface CategoryActionsProps {
  onAddNew: () => void;
  isUserActive: boolean;
}

export function CategoryActions({ onAddNew, isUserActive }: CategoryActionsProps) {
  return (
    <div className="flex flex-row justify-between items-center mb-6">
      <h2 className="text-2xl font-bold dark:text-white">Categorias</h2>
      <Button 
        onClick={onAddNew} 
        disabled={!isUserActive}
        className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        Nova Categoria
      </Button>
    </div>
  );
}
