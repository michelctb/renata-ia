
import { Transaction } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useTransactionForm } from './useTransactionForm';
import { TransactionFormFields } from './TransactionFormFields';
import { useEffect, useState } from 'react';

interface TransactionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Transaction) => Promise<void>;
  editingTransaction: Transaction | null;
  userId: string;
}

export function TransactionFormDialog({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
  userId,
}: TransactionFormDialogProps) {
  console.log('TransactionFormDialog rendered with isOpen:', isOpen);
  console.log('TransactionFormDialog received editingTransaction:', editingTransaction?.id);
  
  // Use a local copy of editingTransaction to avoid infinite loops
  const [localEditingTransaction, setLocalEditingTransaction] = useState<Transaction | null>(null);
  
  // Update local copy only when dialog is opened or editingTransaction changes
  useEffect(() => {
    if (isOpen && editingTransaction) {
      console.log('Updating local editing transaction:', editingTransaction.id);
      // Create a deep copy to avoid reference issues
      setLocalEditingTransaction(JSON.parse(JSON.stringify(editingTransaction)));
    } else if (!isOpen) {
      console.log('Dialog closed, resetting local editing transaction');
      // Clear local transaction when dialog closes
      setLocalEditingTransaction(null);
    }
  }, [isOpen, editingTransaction]);
  
  const {
    form,
    filteredCategories,
    isLoadingCategories,
    handleSubmit
  } = useTransactionForm(userId, localEditingTransaction, onSubmit, onClose);

  const handleOpenChange = (open: boolean) => {
    console.log('Dialog openChange event triggered:', open);
    if (!open) {
      console.log('Dialog closing via openChange event');
      onClose();
    }
  };

  const dialogTitle = localEditingTransaction ? 'Editar Transação' : 'Nova Transação';
  const dialogDescription = localEditingTransaction 
    ? 'Edite os dados da transação selecionada.'
    : 'Preencha os dados para registrar uma nova transação financeira.';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">
            <TransactionFormFields 
              form={form} 
              filteredCategories={filteredCategories}
              isLoadingCategories={isLoadingCategories}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {localEditingTransaction ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
