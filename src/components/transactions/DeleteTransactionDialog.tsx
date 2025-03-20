
import { useEffect, useState, useRef } from 'react';
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

interface DeleteTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  transactionId: number | null;
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  onConfirm,
  transactionId
}: DeleteTransactionDialogProps) {
  console.log('DeleteTransactionDialog render with props:', { open, transactionId });
  
  // Local copy of transaction ID to avoid issues when the original is removed
  const [localTransactionId, setLocalTransactionId] = useState<number | null>(null);
  
  // Ref to track if callbacks have been executed
  const confirmCallbackExecuted = useRef(false);
  
  // Update local copy when dialog opens or transactionId changes
  useEffect(() => {
    if (open && transactionId) {
      console.log('Setting localTransactionId in DeleteDialog:', transactionId);
      setLocalTransactionId(transactionId);
      // Reset callback executed flag when dialog opens
      confirmCallbackExecuted.current = false;
    }
  }, [open, transactionId]);
  
  // Log when dialog opens or closes
  useEffect(() => {
    console.log(`Delete transaction dialog ${open ? 'opened' : 'closed'} for transaction ID:`, localTransactionId);
    
    // Cleanup function
    return () => {
      console.log('Delete transaction dialog component cleanup for transaction ID:', localTransactionId);
    };
  }, [open, localTransactionId]);

  const handleConfirm = () => {
    if (!localTransactionId) {
      console.error('Attempting to confirm delete with null localTransactionId');
      onOpenChange(false);
      return;
    }
    
    // Prevent duplicate calls
    if (confirmCallbackExecuted.current) {
      console.log('Confirm callback already executed, ignoring duplicate call');
      return;
    }
    
    console.log('Delete confirmation clicked for transaction ID:', localTransactionId);
    
    try {
      // Mark callback as executed
      confirmCallbackExecuted.current = true;
      
      // Close the dialog first to prevent UI issues
      onOpenChange(false);
      
      // Then call the confirmation handler with a small delay
      setTimeout(() => {
        try {
          console.log('Executing onConfirm callback for transaction ID:', localTransactionId);
          onConfirm();
        } catch (confirmError) {
          console.error('Error in delayed onConfirm callback:', confirmError);
        }
      }, 100);
    } catch (error) {
      console.error('Error in delete confirmation handler:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente esta transação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            console.log('Cancel button clicked');
            onOpenChange(false);
          }}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-destructive text-destructive-foreground"
            disabled={!localTransactionId || confirmCallbackExecuted.current}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
