
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction } from '@/lib/supabase/types';
import { TransactionRow } from './transactions/TransactionRow';
import { EmptyTransactionRow } from './transactions/EmptyTransactionRow';
import { formatCurrency } from '@/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: number) => void;
  isUserActive: boolean;
  isReadOnly?: boolean;
  filteringData: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filteredTransactions: Transaction[];
    hasFilters: boolean;
    totalReceived: number;
    totalSpent: number;
  };
}

const TransactionTable = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  isUserActive,
  isReadOnly = false,
  filteringData
}: TransactionTableProps) => {
  const {
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    hasFilters,
    totalReceived,
    totalSpent
  } = filteringData;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between p-4 border-b dark:border-gray-700">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Transações
        </div>
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="text-green-500 font-medium">Entradas: </span>
            <span className="font-bold">{formatCurrency(totalReceived)}</span>
          </div>
          <div className="text-sm">
            <span className="text-red-500 font-medium">Saídas: </span>
            <span className="font-bold">{formatCurrency(totalSpent)}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              {!isReadOnly && (
                <TableHead className="text-right">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
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
    </div>
  );
};

export default TransactionTable;
