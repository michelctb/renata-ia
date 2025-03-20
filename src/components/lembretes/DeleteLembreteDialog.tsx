
import { format, parseISO } from 'date-fns';
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
import { useEffect, useState } from 'react';

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
  // Criar uma cópia local do lembrete para evitar problemas quando o lembrete original for removido
  const [localLembrete, setLocalLembrete] = useState<Lembrete>({ ...lembrete });
  
  // Atualiza a cópia local quando o componente monta ou o lembrete muda
  useEffect(() => {
    if (isOpen && lembrete) {
      setLocalLembrete({ ...lembrete });
    }
  }, [isOpen, lembrete]);
  
  // Log when dialog opens or closes
  useEffect(() => {
    const lembreteId = localLembrete?.id || 'unknown';
    console.log(`Delete dialog ${isOpen ? 'opened' : 'closed'} for lembrete ID:`, lembreteId);
    
    // Cleanup function to ensure we log when component unmounts
    return () => {
      console.log('Delete dialog component cleanup for lembrete ID:', lembreteId);
    };
  }, [isOpen, localLembrete?.id]);

  const handleConfirm = () => {
    const lembreteId = localLembrete?.id || 'unknown';
    console.log('Delete confirmation clicked for lembrete ID:', lembreteId);
    
    try {
      // Close the dialog first
      onClose();
      
      // Then call the confirmation handler with a small delay
      setTimeout(() => {
        console.log('Executing onConfirm callback for lembrete ID:', lembreteId);
        onConfirm();
      }, 100);
    } catch (error) {
      console.error('Error in delete confirmation handler:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    console.log('Delete dialog openChange event:', open);
    if (!open) {
      console.log('Dialog closing via openChange event');
      onClose();
    }
  };

  // Formatar a data corretamente para exibição
  const formatData = (dataString?: string) => {
    if (!dataString) return 'data não definida';
    
    try {
      // Extrair ano, mês e dia da string de data
      const [year, month, day] = dataString.split('-').map(Number);
      return format(new Date(year, month - 1, day), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error, dataString);
      return 'data inválida';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Lembrete</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o lembrete{' '}
            <span className="font-medium">{localLembrete.lembrete}</span> com vencimento em{' '}
            <span className="font-medium">
              {formatData(localLembrete.vencimento)}
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
