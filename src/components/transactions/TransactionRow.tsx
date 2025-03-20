
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Transaction } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { ArrowUp, ArrowDown, MoreHorizontal, Pencil, Trash, Lock } from 'lucide-react';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  isUserActive: boolean;
}

export function TransactionRow({ transaction, onEdit, onDelete, isUserActive }: TransactionRowProps) {
  // Function to format the date correctly without timezone issues
  const formatTransactionDate = (dateString: string) => {
    try {
      // Parse the ISO date string
      const date = parseISO(dateString);
      
      // Format the date in the desired format
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return dateString; // Return the original string if parsing fails
    }
  };

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
      <TableCell className="font-medium whitespace-nowrap">
        {formatTransactionDate(transaction.data)}
      </TableCell>
      <TableCell className="truncate max-w-[280px]">
        <div className="truncate" title={transaction.descrição}>
          {transaction.descrição}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {transaction.operação?.toLowerCase() === 'entrada' 
            ? <ArrowUp className="mr-1 h-4 w-4 text-green-500 flex-shrink-0" /> 
            : <ArrowDown className="mr-1 h-4 w-4 text-red-500 flex-shrink-0" />}
          <span className="truncate" title={transaction.categoria}>
            {transaction.categoria}
          </span>
        </div>
      </TableCell>
      <TableCell className={`text-right font-medium whitespace-nowrap ${
        transaction.operação?.toLowerCase() === 'entrada' 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-red-600 dark:text-red-400'
      }`}>
        {formatCurrency(transaction.valor)}
      </TableCell>
      <TableCell className="text-right p-0 pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {isUserActive ? (
              <>
                <DropdownMenuItem onClick={() => onEdit(transaction)} className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(transaction.id as number)}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem disabled className="text-muted-foreground">
                <Lock className="mr-2 h-4 w-4" />
                Acesso somente leitura
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
