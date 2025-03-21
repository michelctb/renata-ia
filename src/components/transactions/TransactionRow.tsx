
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Transaction {
  id: number;
  description?: string;
  descricao?: string; // Legacy field
  value: number;
  date: string;
  category?: string;
  type?: 'income' | 'expense';
  tipo?: 'entrada' | 'saída'; // Legacy field
  payment_method?: string;
  forma_pagamento?: string; // Legacy field
  notes?: string;
  client_id?: string;
  [key: string]: any; // Allow additional properties
}

export interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  isUserActive: boolean;
  isReadOnly?: boolean;
}

export function TransactionRow({ 
  transaction, 
  onEdit, 
  onDelete,
  isUserActive,
  isReadOnly = false
}: TransactionRowProps) {
  // Support both new and legacy field names
  const description = transaction.description || transaction.descricao || '';
  const type = transaction.type || (transaction.tipo === 'entrada' ? 'income' : 'expense');
  const paymentMethod = transaction.payment_method || transaction.forma_pagamento || '';
  
  const isIncome = type === 'income' || transaction.tipo === 'entrada';
  const isExpense = type === 'expense' || transaction.tipo === 'saída';

  const formattedDate = format(new Date(transaction.date), 'dd MMM yyyy', { locale: ptBR });
  const formattedValue = formatCurrency(transaction.value);

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-200">{formattedDate}</div>
      </td>
      
      <td className="py-3 px-4">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{description}</div>
        {transaction.category && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {transaction.category}
          </div>
        )}
      </td>
      
      <td className="py-3 px-4">
        <div className={cn(
          "text-sm font-medium",
          isIncome && "text-green-600 dark:text-green-400",
          isExpense && "text-red-600 dark:text-red-400"
        )}>
          {formattedValue}
        </div>
      </td>
      
      <td className="py-3 px-4">
        <Badge variant="outline" className="text-xs font-normal capitalize">
          {paymentMethod || "N/A"}
        </Badge>
      </td>
      
      <td className="py-3 px-4 text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(transaction)}
          className="h-8 w-8 p-0 mr-1"
          disabled={!isUserActive || isReadOnly}
          title={
            !isUserActive 
              ? "Sua assinatura está inativa. Você não pode editar transações."
              : isReadOnly
                ? "Modo de visualização. Edição não permitida."
                : "Editar transação"
          }
        >
          <PencilIcon className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(transaction.id)}
          className={cn(
            "h-8 w-8 p-0",
            !isUserActive || isReadOnly ? "text-gray-400" : "text-red-500 hover:text-red-700 dark:text-red-400"
          )}
          disabled={!isUserActive || isReadOnly}
          title={
            !isUserActive 
              ? "Sua assinatura está inativa. Você não pode excluir transações."
              : isReadOnly
                ? "Modo de visualização. Exclusão não permitida."
                : "Excluir transação"
          }
        >
          <Trash2Icon className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </td>
    </tr>
  );
}
