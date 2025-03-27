
import { useEffect } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Transaction } from '@/lib/supabase/types';
import { Category } from '@/lib/categories';
import { BatchEditForm, BatchEditFormValues } from './BatchEditForm';

interface BatchEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  selectedTransactions: Transaction[];
  categories: Category[];
  isLoadingCategories: boolean;
}

export function BatchEditDialog({
  isOpen,
  onClose,
  onSubmit,
  selectedTransactions,
  categories,
  isLoadingCategories,
}: BatchEditDialogProps) {
  
  const handleSubmit = async (values: BatchEditFormValues) => {
    const updates: any = {};

    if (values.updateDate && values.data) {
      updates.data = format(values.data, 'yyyy-MM-dd');
    }

    if (values.updateCategory && values.categoria) {
      updates.categoria = values.categoria;
    }

    if (values.updateDescription && values.descrição) {
      updates.descrição = values.descrição;
    }

    await onSubmit(updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edição em lote</DialogTitle>
          <DialogDescription>
            Edite múltiplas transações ao mesmo tempo. Apenas os campos marcados serão atualizados.
          </DialogDescription>
        </DialogHeader>

        <BatchEditForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          selectedTransactions={selectedTransactions}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
        />
      </DialogContent>
    </Dialog>
  );
}
