
import { Transaction } from '@/lib/supabase';
import { TransactionFormDialog } from './transactions/TransactionFormDialog';
import { useEffect } from 'react';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Transaction) => Promise<void>;
  editingTransaction: Transaction | null;
  userId: string;
}

export function TransactionForm(props: TransactionFormProps) {
  // Log when the component props change
  useEffect(() => {
    console.log('TransactionForm props changed - isOpen:', props.isOpen, 'editingTransaction:', props.editingTransaction?.id);
  }, [props.isOpen, props.editingTransaction]);
  
  return <TransactionFormDialog {...props} />;
}

export default TransactionForm;
