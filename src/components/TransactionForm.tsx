
import { Transaction } from '@/lib/supabase';
import { TransactionFormDialog } from './transactions/TransactionFormDialog';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Transaction) => Promise<void>;
  editingTransaction: Transaction | null;
  userId: string;
}

export function TransactionForm(props: TransactionFormProps) {
  return <TransactionFormDialog {...props} />;
}

export default TransactionForm;
