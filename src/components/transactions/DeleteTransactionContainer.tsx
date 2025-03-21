
import { Transaction } from '@/lib/supabase/types';
import { DeleteTransactionDialog } from './DeleteTransactionDialog';

interface DeleteTransactionContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  transaction: Transaction | null;
}

/**
 * Container component for the transaction deletion dialog
 * Used across user, consultant, and client views
 */
export function DeleteTransactionContainer({
  open,
  onOpenChange,
  onConfirm,
  transaction,
}: DeleteTransactionContainerProps) {
  return (
    <DeleteTransactionDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      transaction={transaction}
    />
  );
}
