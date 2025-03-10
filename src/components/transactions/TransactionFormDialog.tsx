
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
  const {
    form,
    filteredCategories,
    isLoadingCategories,
    handleSubmit
  } = useTransactionForm(userId, editingTransaction, onSubmit, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTransaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          <DialogDescription>
            {editingTransaction 
              ? 'Edite os dados da transação selecionada.'
              : 'Preencha os dados para registrar uma nova transação financeira.'}
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
                {editingTransaction ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
