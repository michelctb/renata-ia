
import { Transaction } from '@/lib/supabase/types';
import { TransactionFormDialog } from './TransactionFormDialog';

interface TransactionFormContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Transaction) => Promise<void>;
  editingTransaction: Transaction | null;
  userId: string;
}

/**
 * Container component for the transaction form dialog
 * Used across user, consultant, and client views
 */
export function TransactionFormContainer({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
  userId,
}: TransactionFormContainerProps) {
  return (
    <TransactionFormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      editingTransaction={editingTransaction}
      userId={userId}
    />
  );
}
