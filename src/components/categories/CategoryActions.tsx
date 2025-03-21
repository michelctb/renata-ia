
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface CategoryActionsProps {
  onAddNew: () => void;
  isUserActive: boolean;
}

export function CategoryActions({ onAddNew, isUserActive }: CategoryActionsProps) {
  const handleAddNew = () => {
    // Block inactive users from adding categories
    if (!isUserActive) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar categorias.');
      return;
    }
    
    onAddNew();
  };

  return (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold">Gerenciar Categorias e Metas</h2>
      <Button onClick={handleAddNew} disabled={!isUserActive}>
        <PlusIcon className="h-4 w-4 mr-1" />
        Nova Categoria
      </Button>
    </div>
  );
}
