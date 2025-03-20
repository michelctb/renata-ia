
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Lembrete } from '@/lib/lembretes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect } from 'react';

interface DeleteLembreteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lembrete: Lembrete;
}

export function DeleteLembreteDialog({
  isOpen,
  onClose,
  onConfirm,
  lembrete,
}: DeleteLembreteDialogProps) {
  // Log when dialog opens or closes
  useEffect(() => {
    console.log(`Delete dialog ${isOpen ? 'opened' : 'closed'} for lembrete ID:`, lembrete.id);
  }, [isOpen, lembrete.id]);

  const handleConfirm = () => {
    console.log('Delete confirmation clicked for lembrete ID:', lembrete.id);
    // Call onConfirm after a small delay to allow the dialog to close
    onConfirm();
  };

  const handleOpenChange = (open: boolean) => {
    console.log('Delete dialog openChange event:', open);
    if (!open) {
      console.log('Dialog closing via openChange event');
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Lembrete</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o lembrete{' '}
            <span className="font-medium">{lembrete.lembrete}</span> com vencimento em{' '}
            <span className="font-medium">
              {lembrete.vencimento ? 
                format(new Date(lembrete.vencimento), 'dd/MM/yyyy', { locale: ptBR }) : 
                'data não definida'}
            </span>?
            <br />
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            console.log('Cancel button clicked');
            onClose();
          }}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
