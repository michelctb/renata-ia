
import React from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import {
  Table,
  TableBody,
} from '@/components/ui/table';
import { ScrollArea } from './ui/scroll-area';
import { SearchInput } from './transactions/SearchInput';
import { TransactionTableHeader } from './transactions/TransactionTableHeader';
import { EmptyTransactionRow } from './transactions/EmptyTransactionRow';
import { TransactionRow } from './transactions/TransactionRow';
import { useTransactionFiltering } from './transactions/useTransactionFiltering';

interface TransactionTableProps {
  transactions: Transaction[];
  dateRange: DateRange | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  isUserActive?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  dateRange, 
  onEdit, 
  onDelete,
  isUserActive = true
}) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredTransactions, 
    hasFilters 
  } = useTransactionFiltering(transactions, dateRange);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 animate-fade-in hover:shadow-lg">
      <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Histórico de Transações</h3>
        <SearchInput 
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>
      
      <ScrollArea className="h-[400px]">
        <Table>
          <TransactionTableHeader />
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <EmptyTransactionRow hasFilters={hasFilters} />
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionRow 
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isUserActive={isUserActive}
                />
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default TransactionTable;
