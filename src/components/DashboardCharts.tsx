
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyChart } from './charts/MonthlyChart';
import { ExpensesPieChart } from './charts/ExpensesPieChart';
import { ExpensesRanking } from './charts/ExpensesRanking';

type DashboardChartsProps = {
  transactions: Transaction[];
  dateRange: DateRange | null;
};

export default function DashboardCharts({ transactions, dateRange }: DashboardChartsProps) {
  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    if (!dateRange || !dateRange.from) return transactions;
    
    return transactions.filter(transaction => {
      // Parse the date with timezone consideration
      const transactionDateStr = transaction.data;
      const transactionDate = parseISO(transactionDateStr);
      
      // Adjust the transaction date to America/Sao_Paulo timezone
      const zonedDate = zonedTimeToUtc(transactionDate, 'America/Sao_Paulo');
      
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(zonedDate, { 
          start: dateRange.from, 
          end: dateRange.to 
        });
      }
      
      if (dateRange.from) {
        return zonedDate >= dateRange.from;
      }
      
      return true;
    });
  }, [transactions, dateRange]);

  // Prepare data for monthly income/expense bar chart
  const monthlyData = useMemo(() => {
    const months = new Map();
    
    filteredTransactions.forEach(transaction => {
      // Parse the date with timezone consideration
      const dateStr = transaction.data;
      const date = parseISO(dateStr);
      
      // Adjust the date to America/Sao_Paulo timezone
      const zonedDate = zonedTimeToUtc(date, 'America/Sao_Paulo');
      
      const monthKey = format(zonedDate, 'yyyy-MM');
      const monthLabel = format(zonedDate, 'MMM yyyy', { locale: ptBR });
      const operationType = transaction.operação?.toLowerCase() || '';
      
      if (!months.has(monthKey)) {
        months.set(monthKey, { 
          name: monthLabel, 
          entrada: 0, 
          saída: 0 
        });
      }
      
      const monthData = months.get(monthKey);
      
      if (operationType === 'entrada') {
        monthData.entrada += Number(transaction.valor);
      } else if (operationType === 'saída') {
        monthData.saída += Number(transaction.valor);
      }
    });
    
    return Array.from(months.values())
      .sort((a, b) => {
        const dateA = parseISO(`${a.name.split(' ')[1]}-${ptBR.localize?.month(new Date(`${a.name.split(' ')[0]} 1, 2000`).getMonth())}-01`);
        const dateB = parseISO(`${b.name.split(' ')[1]}-${ptBR.localize?.month(new Date(`${b.name.split(' ')[0]} 1, 2000`).getMonth())}-01`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [filteredTransactions]);

  // Prepare data for expenses by category pie chart
  const categoryData = useMemo(() => {
    const categories = new Map();
    
    // Process all expense transactions with case-insensitive check
    filteredTransactions
      .filter(t => t.operação?.toLowerCase() === 'saída')
      .forEach(transaction => {
        // Handle empty or undefined category
        const category = transaction.categoria?.trim() || 'Sem categoria';
        
        if (!categories.has(category)) {
          categories.set(category, { 
            name: category, 
            value: 0 
          });
        }
        
        const categoryData = categories.get(category);
        categoryData.value += Number(transaction.valor || 0);
      });
    
    // Convert the Map to Array and sort by value (highest first)
    return Array.from(categories.values())
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Log category data for debugging
  console.log('Category data processed:', categoryData);
  console.log('Total categories found:', categoryData.length);
  console.log('Filtered transactions with expense type:', filteredTransactions.filter(t => t.operação?.toLowerCase() === 'saída').length);
  console.log('All transaction operation types:', [...new Set(filteredTransactions.map(t => t.operação))]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-3" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-2">
          <CardTitle>Entradas e Saídas por Mês</CardTitle>
          <CardDescription>Visualização mensal de valores recebidos e pagos</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <MonthlyChart data={monthlyData} />
        </CardContent>
      </Card>

      <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-2" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-2">
          <CardTitle>Saídas por Categoria</CardTitle>
          <CardDescription>Distribuição de gastos por categoria no período</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ExpensesPieChart data={categoryData} />
        </CardContent>
      </Card>

      <Card className="border-none shadow-md animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="pb-2">
          <CardTitle>Ranking de Categorias</CardTitle>
          <CardDescription>Maiores gastos por categoria no período</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpensesRanking data={categoryData} />
        </CardContent>
      </Card>
    </div>
  );
};
