
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
import { ArrowUp, ArrowDown, Search, MoreHorizontal, Pencil, Trash, Lock } from 'lucide-react';
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
    // Filtrar por data
    let matchesDateRange = true;
    if (dateRange && dateRange.from) {
      const transactionDate = parseISO(transaction.data);
      
      if (dateRange.to) {
        // Verificar se está dentro do intervalo (inclusivo)
        matchesDateRange = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
        
        // Debug para transações de 01/03
        if (transaction.data.includes('2025-03-01')) {
          console.log('TransactionTable - Transação 01/03:', 
            transaction.data,
            'Intervalo:', dateRange.from.toISOString(), 'até', dateRange.to.toISOString(),
            'Incluída?', matchesDateRange
          );
        }
      } else {
        matchesDateRange = transactionDate >= dateRange.from;
      }
    }
      
    // Filtrar por termo de busca
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
      
      // Format the date in the desired format
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return dateString; // Return the original string if parsing fails
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 animate-fade-in hover:shadow-lg">
      <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Histórico de Transações</h3>
        <div className="relative">
          <Input
            className="w-56 pl-8 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Buscar transação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
            <TableRow>
              <TableHead className="w-[100px] min-w-[100px]">Data</TableHead>
              <TableHead className="w-[280px] min-w-[200px]">Descrição</TableHead>
              <TableHead className="w-[180px] min-w-[150px]">Categoria</TableHead>
              <TableHead className="text-right w-[120px] min-w-[120px]">Valor</TableHead>
              <TableHead className="w-[60px] min-w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {searchTerm || dateRange?.from 
                    ? "Nenhuma transação encontrada para os filtros selecionados." 
                    : "Nenhuma transação registrada ainda."}
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
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
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default TransactionTable;
