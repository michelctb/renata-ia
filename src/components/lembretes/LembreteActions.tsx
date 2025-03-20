
import { useState, useCallback, useEffect, useRef } from 'react';
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
  console.log('LembreteActions rendered for ID:', lembrete?.id);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localLembrete, setLocalLembrete] = useState<Lembrete | null>(null);
  
  // Ref para rastrear se o componente está montado
  const isMounted = useRef(true);
  
  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (lembrete) {
      console.log('Updating localLembrete in LembreteActions with ID:', lembrete.id);
      setLocalLembrete(JSON.parse(JSON.stringify(lembrete)));
    }
  }, [lembrete]);

  const handleEdit = useCallback(() => {
    if (isProcessing) {
      console.log('Edit action blocked: processing in progress');
      return;
    }
    
    if (!lembrete.id) {
      console.error('ID do lembrete não encontrado para edição');
      toast.error('Não foi possível editar este lembrete. ID não encontrado.');
      return;
    }
    
    console.log('Editing lembrete with ID:', lembrete.id);
    onEdit();
  }, [lembrete, onEdit, isProcessing]);

  const handleDeleteClick = useCallback(() => {
    console.log('Delete menu item clicked for lembrete ID:', lembrete?.id);
    setIsDeleteDialogOpen(true);
  }, [lembrete?.id]);

  const handleDeleteConfirm = useCallback(() => {
    if (isProcessing) {
      console.log('Delete action blocked: processing in progress');
      return;
    }
    
    if (!localLembrete || !localLembrete.id) {
      console.error('localLembrete is null or has no ID in handleDeleteConfirm');
      toast.error('Não foi possível excluir este lembrete. Dados não encontrados.');
      setIsDeleteDialogOpen(false);
      return;
    }
    
    try {
      console.log('Starting delete process for lembrete with ID:', localLembrete.id);
      
      console.log('Calling parent onDelete callback');
      // Fechamos o diálogo antes de chamar onDelete para evitar problemas de UI
      setIsDeleteDialogOpen(false);
      
      // Pequeno delay para garantir que o estado foi atualizado
      setTimeout(() => {
        if (isMounted.current) {
          onDelete();
        }
      }, 100);
      
    } catch (error) {
      console.error('Error handling delete action:', error);
      toast.error('Erro ao processar exclusão do lembrete. Tente novamente.');
      if (isMounted.current) {
        setIsDeleteDialogOpen(false);
      }
    }
  }, [localLembrete, onDelete, isProcessing]);

  const handleCloseDeleteDialog = useCallback(() => {
    console.log('Delete dialog close request');
    setIsDeleteDialogOpen(false);
  }, []);

  if (!localLembrete) {
    console.log('LembreteActions: localLembrete is null, rendering empty fragment');
    return <></>;
  }

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

      {localLembrete && (
        <DeleteLembreteDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteConfirm}
          lembrete={localLembrete}
        />
      )}
    </>
  );
}
