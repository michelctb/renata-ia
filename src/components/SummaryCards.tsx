
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from 'lucide-react';
import { Transaction } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

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
    
    // Filter transactions by date range if provided
    const filteredTransactions = transactions.filter(transaction => {
      if (!dateRange || !dateRange.from) return true;
      
      try {
        // Parse a data da transação e converter para o fuso horário de São Paulo
        const transactionDateStr = transaction.data;
        const transactionDateUTC = parseISO(transactionDateStr);
        const transactionDateSaoPaulo = toZonedTime(transactionDateUTC, TIMEZONE);
        
        // Normalizar para o início do dia
        const transactionDate = startOfDay(transactionDateSaoPaulo);
        
        // Normalizar as datas do intervalo para o fuso horário de São Paulo
        const fromDate = startOfDay(toZonedTime(dateRange.from, TIMEZONE));
        const toDate = dateRange.to ? endOfDay(toZonedTime(dateRange.to, TIMEZONE)) : null;
        
        if (fromDate && toDate) {
          // Verificar se a data da transação está dentro do intervalo (inclusivo)
          return transactionDate >= fromDate && transactionDate <= toDate;
        }
        
        if (fromDate) {
          return transactionDate >= fromDate;
        }
        
        return true;
      } catch (error) {
        console.error('Error processing date:', transaction.data, error);
        return false;
      }
    });
    
    console.log(`Filtered from ${transactions.length} to ${filteredTransactions.length} transactions based on date range:`, 
      dateRange ? `${dateRange.from?.toISOString()} to ${dateRange.to?.toISOString()}` : 'No date range');
    
    // Calculate totals - making operation check case-insensitive
    filteredTransactions.forEach(transaction => {
      const operationType = transaction.operação?.toLowerCase() || '';
      
      if (operationType === 'entrada') {
        income += transaction.valor;
      } else if (operationType === 'saída' || operationType === 'saida') {
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
      <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-2 pt-4">
          <CardDescription>Entradas</CardDescription>
          <CardTitle className="text-2xl flex items-center text-income">
            <ArrowUpIcon className="mr-2 h-5 w-5" />
            {formatCurrency(summary.income)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-sm text-muted-foreground">Valores recebidos no período</div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-2 pt-4">
          <CardDescription>Saídas</CardDescription>
          <CardTitle className="text-2xl flex items-center text-expense">
            <ArrowDownIcon className="mr-2 h-5 w-5" />
            {formatCurrency(summary.expenses)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-sm text-muted-foreground">Valores pagos no período</div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm" style={{ animationDelay: '0.3s' }}>
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
