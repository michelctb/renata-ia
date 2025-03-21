
import { Transaction } from '@/lib/supabase/types';
import TransactionTable from '../TransactionTable';

interface TransactionTableContainerProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: number) => void;
  isUserActive: boolean;
  isReadOnly: boolean;
  filteringData: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filteredTransactions: Transaction[];
    hasFilters: boolean;
    totalReceived: number;
    totalSpent: number;
  };
}

/**
 * Container component for the transaction table
 * Used across user, consultant, and client views
 */
export function TransactionTableContainer({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  isUserActive,
  isReadOnly,
  filteringData,
}: TransactionTableContainerProps) {
  return (
    <TransactionTable
      transactions={transactions}
      onEditTransaction={onEditTransaction}
      onDeleteTransaction={onDeleteTransaction}
      isUserActive={isUserActive}
      isReadOnly={isReadOnly}
      filteringData={filteringData}
    />
  );
}
