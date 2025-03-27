
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Transaction } from '@/lib/supabase/types';
import { parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';

const TIMEZONE = 'America/Sao_Paulo';

export interface TransactionRowProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  isUserActive: boolean;
  isReadOnly?: boolean;
  hasSelection?: boolean;
  onSelectTransaction?: (id: number, selected: boolean) => void;
}

export function TransactionRow({ 
  transaction, 
  onEdit, 
  onDelete,
  isUserActive,
  isReadOnly = false,
  hasSelection = false,
  onSelectTransaction
}: TransactionRowProps) {
  // Support both new and legacy field names
  const description = transaction.descrição || '';
  const type = transaction.operação || '';
  
  const isIncome = type === 'entrada';
  const isExpense = type === 'saída';

  // Formatação da data considerando o fuso horário de São Paulo
  const dateSaoPaulo = toZonedTime(parseISO(transaction.data), TIMEZONE);
  const formattedDate = format(dateSaoPaulo, 'dd MMM yyyy', { locale: ptBR });
  const formattedValue = formatCurrency(transaction.valor);

  const handleCheckboxChange = (checked: boolean) => {
    if (onSelectTransaction && transaction.id) {
      onSelectTransaction(transaction.id, checked);
    }
  };

  return (
    <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      {hasSelection && !isReadOnly && (
        <TableCell className="py-3 px-4">
          <Checkbox 
            checked={transaction.selected || false} 
            onCheckedChange={handleCheckboxChange}
            aria-label={`Selecionar transação ${transaction.id}`}
          />
        </TableCell>
      )}
      
      <TableCell className="py-3 px-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-200">{formattedDate}</div>
      </TableCell>
      
      <TableCell className="py-3 px-4">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{description}</div>
      </TableCell>
      
      <TableCell className="py-3 px-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {transaction.categoria}
        </div>
      </TableCell>
      
      <TableCell className="py-3 px-4 text-right">
        <div className={cn(
          "text-sm font-medium",
          isIncome && "text-green-600 dark:text-green-400",
          isExpense && "text-red-600 dark:text-red-400"
        )}>
          {formattedValue}
        </div>
      </TableCell>
      
      {!isReadOnly && (
        <TableCell className="py-3 px-4 text-right">
          <div className="flex justify-end space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
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
              onClick={onDelete}
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
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
