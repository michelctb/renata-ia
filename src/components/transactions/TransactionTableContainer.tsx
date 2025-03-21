
import { Transaction } from '@/lib/supabase/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TransactionTableHeader } from './TransactionTableHeader';
import { TransactionRow } from './TransactionRow';
import { EmptyTransactionRow } from './EmptyTransactionRow';
import { Table, TableBody } from '@/components/ui/table';

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
  const {
    filteredTransactions,
    searchTerm
  } = filteringData;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Transações
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="min-w-full">
          <Table>
            <TransactionTableHeader isReadOnly={isReadOnly} />
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={() => onEditTransaction(transaction)}
                    onDelete={() => onDeleteTransaction(transaction.id as number)}
                    isUserActive={isUserActive}
                    isReadOnly={isReadOnly}
                  />
                ))
              ) : (
                <EmptyTransactionRow searchTerm={searchTerm} />
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
