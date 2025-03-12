
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { format as formatTZ } from 'date-fns-tz';
import { Transaction } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  EditIcon, 
  SearchIcon, 
  Trash2Icon, 
  XIcon 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  dateRange: DateRange | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionTable = ({ 
  transactions, 
  dateRange, 
  onEdit, 
  onDelete 
}: TransactionTableProps) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter transactions by date range and search term
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by date range
    if (dateRange?.from || dateRange?.to) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.data);
        
        if (dateRange?.from && dateRange?.to) {
          return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
        }
        
        if (dateRange?.from) {
          return transactionDate >= dateRange.from;
        }
        
        if (dateRange?.to) {
          return transactionDate <= dateRange.to;
        }
        
        return true;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        transaction =>
          transaction.descrição.toLowerCase().includes(term) ||
          transaction.categoria.toLowerCase().includes(term)
      );
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, dateRange, searchTerm]);

  // Sort by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.data).getTime() - new Date(a.data).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Transações</h2>
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <XIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="transaction-card">
                  <TableCell className="font-medium">
                    {formatTZ(parseISO(transaction.data), 'dd/MM/yyyy', { 
                      timeZone: 'America/Sao_Paulo',
                      locale: ptBR 
                    })}
                  </TableCell>
                  <TableCell>{transaction.descrição}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                      {transaction.categoria}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center ${
                      transaction.operação?.toLowerCase() === 'entrada' ? 'text-income' : 'text-expense'
                    }`}>
                      {transaction.operação?.toLowerCase() === 'entrada' ? (
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {formatCurrency(transaction.valor)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8"
                        aria-label="Editar"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction.id!)}
                        className="h-8 w-8 text-destructive"
                        aria-label="Excluir"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
