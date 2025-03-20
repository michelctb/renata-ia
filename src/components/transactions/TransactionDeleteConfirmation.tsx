
import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

interface TransactionDeleteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReload: () => void;
}

export function TransactionDeleteConfirmation({
  open,
  onOpenChange,
  onReload
}: TransactionDeleteConfirmationProps) {
  useEffect(() => {
    // If dialog is opened, set a timer to auto-close and reload after 3 seconds
    if (open) {
      const timer = setTimeout(() => {
        console.log('Auto-closing confirmation dialog and reloading...');
        onOpenChange(false);
        onReload();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange, onReload]);

  const handleContinue = () => {
    console.log('User clicked continue, closing dialog and reloading...');
    onOpenChange(false);
    onReload();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl">Transação Excluída</AlertDialogTitle>
          <div className="flex justify-center my-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <AlertDescription className="text-center py-2">
              A transação foi excluída com sucesso!
            </AlertDescription>
          </Alert>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-center mt-2">
          A página será atualizada automaticamente em alguns segundos.
        </AlertDialogDescription>
        <AlertDialogFooter className="flex justify-center mt-4">
          <AlertDialogAction 
            onClick={handleContinue}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
