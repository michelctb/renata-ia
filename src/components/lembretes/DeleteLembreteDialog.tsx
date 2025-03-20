
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
import { useEffect, useState, useRef } from 'react';

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
  console.log('DeleteLembreteDialog render with props:', { isOpen, lembrete: lembrete?.id });
  
  // Criar uma cópia local do lembrete para evitar problemas quando o lembrete original for removido
  const [localLembrete, setLocalLembrete] = useState<Lembrete | null>(null);
  
  // Ref para rastrear se o callback de confirmação já foi chamado
  const confirmCallbackExecuted = useRef(false);
  
  // Atualiza a cópia local quando o componente monta ou o lembrete muda
  useEffect(() => {
    if (isOpen && lembrete) {
      console.log('Setting localLembrete in DeleteDialog with data:', JSON.stringify(lembrete));
      // Deep copy para garantir que não temos referências ao objeto original
      setLocalLembrete(JSON.parse(JSON.stringify(lembrete)));
      // Resetar o flag de callback quando o diálogo abre
      confirmCallbackExecuted.current = false;
    }
  }, [isOpen, lembrete]);
  
  // Log when dialog opens or closes
  useEffect(() => {
    const lembreteId = localLembrete?.id || 'unknown';
    console.log(`Delete dialog ${isOpen ? 'opened' : 'closed'} for lembrete ID:`, lembreteId);
    console.log('Current localLembrete state:', localLembrete);
    
    // Cleanup function to ensure we log when component unmounts
    return () => {
      console.log('Delete dialog component cleanup for lembrete ID:', lembreteId);
    };
  }, [isOpen, localLembrete]);

  const handleConfirm = () => {
    if (!localLembrete) {
      console.error('Attempting to confirm delete with null localLembrete');
      onClose();
      return;
    }
    
    // Evitar chamadas duplicadas
    if (confirmCallbackExecuted.current) {
      console.log('Confirm callback already executed, ignoring duplicate call');
      return;
    }
    
    const lembreteId = localLembrete?.id || 'unknown';
    console.log('Delete confirmation clicked for lembrete ID:', lembreteId);
    console.log('Current localLembrete at confirmation time:', JSON.stringify(localLembrete));
    
    try {
      // Marcar que o callback já foi executado
      confirmCallbackExecuted.current = true;
      
      // Close the dialog first to prevent UI issues
      onClose();
      
      // Then call the confirmation handler with a small delay to ensure state updates properly
      setTimeout(() => {
        try {
          console.log('Executing onConfirm callback for lembrete ID:', lembreteId);
          onConfirm();
        } catch (confirmError) {
          console.error('Error in delayed onConfirm callback:', confirmError);
        }
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
      
      // Criar um objeto Date com horário meio-dia para evitar problemas de fuso horário
      const date = new Date(year, month - 1, day, 12, 0, 0);
      
      // Formatar a data usando o format do date-fns
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error, dataString);
      return 'data inválida';
    }
  };

  // Proteger contra localLembrete sendo null - este é um momento crítico
  if (!localLembrete && isOpen) {
    console.error('localLembrete is null but dialog is open - this should not happen');
    return null; // Não renderiza o diálogo se não temos dados
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Lembrete</AlertDialogTitle>
          <AlertDialogDescription>
            {localLembrete ? (
              <>
                Tem certeza que deseja excluir o lembrete{' '}
                <span className="font-medium">{localLembrete.lembrete}</span> com vencimento em{' '}
                <span className="font-medium">
                  {formatData(localLembrete.vencimento)}
                </span>?
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </>
            ) : (
              'Carregando detalhes do lembrete...'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            console.log('Cancel button clicked');
            onClose();
          }}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-red-600 hover:bg-red-700"
            disabled={!localLembrete || confirmCallbackExecuted.current}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
