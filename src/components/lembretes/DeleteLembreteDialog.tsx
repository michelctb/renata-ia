
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
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
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
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
