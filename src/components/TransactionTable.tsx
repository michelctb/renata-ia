
import React, { useState } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/transactions/SearchInput';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { TransactionTableHeader } from '@/components/transactions/TransactionTableHeader';
import { EmptyTransactionRow } from '@/components/transactions/EmptyTransactionRow';
import { useTransactionFiltering } from '@/components/transactions/useTransactionFiltering';

export interface TransactionTableProps {
  transactions: Transaction[];
  dateRange: DateRange | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

const TransactionTable = ({ 
  transactions, 
  dateRange,
  onEdit,
  onDelete,
  isUserActive,
  viewMode = 'user'
}: TransactionTableProps) => {
  const { 
    searchQuery, 
    setSearchQuery,
    visibleTransactions,
    totalReceived,
    totalSpent
  } = useTransactionFiltering(transactions, dateRange);
  
  const isReadOnly = viewMode === 'consultor';

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="p-4 bg-white dark:bg-gray-800">
        <SearchInput 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar transações..."
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <TransactionTableHeader />
          
          <tbody className="bg-white dark:bg-gray-800">
            {visibleTransactions.length > 0 ? (
              visibleTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isUserActive={isUserActive}
                  isReadOnly={isReadOnly}
                />
              ))
            ) : (
              <EmptyTransactionRow searchQuery={searchQuery} />
            )}
          </tbody>
          
          <tfoot className="bg-gray-50 dark:bg-gray-700/60 text-sm font-medium">
            <tr>
              <td colSpan={2} className="px-4 py-3 text-gray-500 dark:text-gray-400">
                Resumo:
              </td>
              <td className="px-4 py-3 text-green-600 dark:text-green-400 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceived)}
              </td>
              <td className="px-4 py-3 text-red-600 dark:text-red-400 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceived - totalSpent)}
              </td>
              <td className="px-4 py-3 text-right"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};

export default TransactionTable;
