
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Transaction } from '@/lib/supabase';
import { 
  PencilIcon, 
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function TransactionRow({ 
  transaction, 
  onEdit, 
  onDelete,
  isUserActive,
  viewMode = 'user'
}: TransactionRowProps) {
  const isReadOnly = viewMode === 'consultor';
  const formattedDate = format(parseISO(transaction.data), 'dd/MM/yyyy', { locale: ptBR });
  
  const valueClass = transaction.tipo === 'entrada' 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
  
  const formattedValue = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(transaction.valor as number);
  
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="px-4 py-3 text-sm">
        {formattedDate}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 dark:text-white">{transaction.descricao}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.categoria}</div>
      </td>
      <td className="px-4 py-3 text-right">
        {transaction.tipo === 'entrada' && (
          <span className="text-green-600 dark:text-green-400">{formattedValue}</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {transaction.tipo === 'saída' && (
          <span className="text-red-600 dark:text-red-400">{formattedValue}</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center gap-1 justify-end">
          {transaction.tipo === 'entrada' ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          )}
          <span className={valueClass}>{transaction.forma_pagamento}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(transaction)}
            disabled={!isUserActive || isReadOnly}
            className="h-8 w-8"
          >
            <PencilIcon className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(transaction.id as number)}
            disabled={!isUserActive || isReadOnly}
            className="h-8 w-8 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </td>
    </tr>
  );
}
