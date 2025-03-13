
import { useState } from 'react';
import { Lembrete, deleteLembrete } from '@/lib/lembretes';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteLembreteDialog } from './DeleteLembreteDialog';
import { toast } from 'sonner';

interface LembreteActionsProps {
  lembrete: Lembrete;
  onEdit: () => void;
  onDelete: () => void;
}

export function LembreteActions({ lembrete, onEdit, onDelete }: LembreteActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      if (!lembrete.id) {
        throw new Error('ID do lembrete não encontrado');
      }
      
      await deleteLembrete(lembrete.id);
      toast.success('Lembrete excluído com sucesso');
      onDelete();
    } catch (error) {
      console.error('Error deleting lembrete:', error);
      toast.error('Erro ao excluir o lembrete. Tente novamente.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteLembreteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        lembrete={lembrete}
      />
    </>
  );
}
