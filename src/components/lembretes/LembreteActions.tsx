
import { useState, useCallback } from 'react';
import { Lembrete } from '@/lib/lembretes';
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

  const handleEdit = useCallback(() => {
    if (isProcessing) {
      console.log('Edit action blocked: processing in progress');
      return;
    }
    
    // Make sure the lembrete has an ID before proceeding
    if (!lembrete.id) {
      console.error('ID do lembrete não encontrado para edição');
      toast.error('Não foi possível editar este lembrete. ID não encontrado.');
      return;
    }
    
    // Pass the complete lembrete object to the edit handler
    console.log('Editing lembrete with ID:', lembrete.id);
    onEdit();
  }, [lembrete, onEdit, isProcessing]);

  const handleDeleteClick = useCallback(() => {
    console.log('Delete menu item clicked for lembrete ID:', lembrete.id);
    setIsDeleteDialogOpen(true);
  }, [lembrete.id]);

  const handleDeleteConfirm = useCallback(() => {
    if (isProcessing) {
      console.log('Delete action blocked: processing in progress');
      return;
    }
    
    try {
      if (!lembrete.id) {
        console.error('ID do lembrete não encontrado para exclusão');
        toast.error('Não foi possível excluir este lembrete. ID não encontrado.');
        return;
      }
      
      console.log('Starting delete process for lembrete with ID:', lembrete.id);
      
      // The dialog will be closed by its own component
      
      // Then call the parent's onDelete callback
      console.log('Calling parent onDelete callback');
      onDelete();
      
    } catch (error) {
      console.error('Error handling delete action:', error);
      toast.error('Erro ao processar exclusão do lembrete. Tente novamente.');
      setIsDeleteDialogOpen(false);
    }
  }, [lembrete.id, onDelete, isProcessing]);

  const handleCloseDeleteDialog = useCallback(() => {
    console.log('Delete dialog close request');
    setIsDeleteDialogOpen(false);
  }, []);

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
                onClick={handleDeleteClick}
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
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        lembrete={lembrete}
      />
    </>
  );
}
