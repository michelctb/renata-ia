
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/utils';
import { ArrowUp, ArrowDown, Calendar, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter transactions by date range and search term
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.data);
    const matchesDateRange = dateRange 
      ? (
          (!dateRange.from || transactionDate >= dateRange.from) && 
          (!dateRange.to || transactionDate <= dateRange.to)
        )
      : true;
      
    const matchesSearch = searchTerm 
      ? transaction.descrição.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    return matchesDateRange && matchesSearch;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.data).getTime() - new Date(a.data).getTime();
  });

  // Function to format the date correctly without timezone issues
  const formatTransactionDate = (dateString: string) => {
    try {
      // Parse the ISO date string
      const date = parseISO(dateString);
      
      // Add a day to fix timezone issue (if needed)
      // This is needed because the date might be losing a day due to timezone conversion
      // const fixedDate = addDays(date, 1);
      
      // Format the date in the desired format
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return dateString; // Return the original string if parsing fails
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Histórico de Transações</h3>
        <div className="relative">
          <Input
            className="w-56 pl-8"
            placeholder="Buscar transação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[110px]">Data</TableHead>
              <TableHead className="w-[250px]">Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm || dateRange?.from 
                    ? "Nenhuma transação encontrada para os filtros selecionados." 
                    : "Nenhuma transação registrada ainda."}
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatTransactionDate(transaction.data)}
                  </TableCell>
                  <TableCell>{transaction.descrição}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.operação?.toLowerCase() === 'entrada' 
                        ? <ArrowUp className="mr-1 h-4 w-4 text-green-500" /> 
                        : <ArrowDown className="mr-1 h-4 w-4 text-red-500" />}
                      {transaction.categoria}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.operação?.toLowerCase() === 'entrada' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formatCurrency(transaction.valor)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isUserActive ? (
                          <>
                            <DropdownMenuItem onClick={() => onEdit(transaction)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDelete(transaction.id as number)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem disabled className="text-muted-foreground">
                            <span className="mr-2">🔒</span>
                            Acesso somente leitura
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default TransactionTable;
