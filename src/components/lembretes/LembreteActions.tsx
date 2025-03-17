
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
  isUserActive?: boolean;
  isProcessing?: boolean;
}

export function LembreteActions({ 
  lembrete, 
  onEdit, 
  onDelete, 
  isUserActive = true,
  isProcessing = false
}: LembreteActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    if (isProcessing) return;
    onEdit();
  };

  const handleDelete = async () => {
    if (isProcessing) return;
    
    try {
      if (!lembrete.id) {
        throw new Error('ID do lembrete não encontrado');
      }
      
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
          <Button variant="ghost" size="icon" disabled={isProcessing}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isUserActive && (
            <>
              <DropdownMenuItem onClick={handleEdit} disabled={isProcessing}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 focus:text-red-600"
                disabled={isProcessing}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </>
          )}
          {!isUserActive && (
            <DropdownMenuItem disabled className="text-muted-foreground">
              <span className="mr-2">🔒</span>
              Acesso somente leitura
            </DropdownMenuItem>
          )}
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
