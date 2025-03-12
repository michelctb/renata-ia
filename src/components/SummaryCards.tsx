
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from 'lucide-react';
import { Transaction } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

type SummaryCardsProps = {
  transactions: Transaction[];
  dateRange: DateRange | null;
};

const SummaryCards = ({ transactions, dateRange }: SummaryCardsProps) => {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  useEffect(() => {
    let income = 0;
    let expenses = 0;
    
    // Filter transactions by date range if provided - usando a coluna 'data'
    const filteredTransactions = transactions.filter(transaction => {
      if (!dateRange || !dateRange.from) return true;
      
      const transactionDate = new Date(transaction.data);
      
      if (dateRange.from && dateRange.to) {
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      }
      
      if (dateRange.from) {
        return transactionDate >= dateRange.from;
      }
      
      return true;
    });
    
    // Calculate totals - making operation check case-insensitive
    filteredTransactions.forEach(transaction => {
      const operationType = transaction.operação?.toLowerCase() || '';
      
      if (operationType === 'entrada') {
        income += transaction.valor;
      } else if (operationType === 'saída') {
        expenses += transaction.valor;
      }
    });
    
    const balance = income - expenses;
    
    setSummary({
      income,
      expenses,
      balance,
    });
  }, [transactions, dateRange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="border-none shadow-md animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-2 pt-4">
          <CardDescription>Total de Entradas</CardDescription>
          <CardTitle className="text-2xl flex items-center text-income">
            <ArrowUpIcon className="mr-2 h-5 w-5" />
            {formatCurrency(summary.income)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-sm text-muted-foreground">Valores recebidos no período</div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-2 pt-4">
          <CardDescription>Total de Saídas</CardDescription>
          <CardTitle className="text-2xl flex items-center text-expense">
            <ArrowDownIcon className="mr-2 h-5 w-5" />
            {formatCurrency(summary.expenses)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-sm text-muted-foreground">Valores pagos no período</div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="pb-2 pt-4">
          <CardDescription>Saldo</CardDescription>
          <CardTitle className={`text-2xl flex items-center ${summary.balance >= 0 ? 'text-income' : 'text-expense'}`}>
            <TrendingUpIcon className="mr-2 h-5 w-5" />
            {formatCurrency(summary.balance)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-sm text-muted-foreground">Resultado financeiro no período</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
