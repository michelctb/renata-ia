
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { format, parse, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
      const transactionDate = new Date(transaction.data);
      
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(transactionDate, { 
          start: dateRange.from, 
          end: dateRange.to 
        });
      }
      
      if (dateRange.from) {
        return transactionDate >= dateRange.from;
      }
      
      return true;
    });
  }, [transactions, dateRange]);

  // Prepare data for monthly income/expense bar chart
  const monthlyData = useMemo(() => {
    const months = new Map();
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.data);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
      
      if (!months.has(monthKey)) {
        months.set(monthKey, { 
          name: monthLabel, 
          entrada: 0, 
          saída: 0 
        });
      }
      
      const monthData = months.get(monthKey);
      
      if (transaction.operação === 'entrada') {
        monthData.entrada += Number(transaction.valor);
      } else {
        monthData.saída += Number(transaction.valor);
      }
    });
    
    return Array.from(months.values())
      .sort((a, b) => {
        const dateA = parse(a.name, 'MMM yyyy', new Date(), { locale: ptBR });
        const dateB = parse(b.name, 'MMM yyyy', new Date(), { locale: ptBR });
        return dateA.getTime() - dateB.getTime();
      });
  }, [filteredTransactions]);

  // Prepare data for expenses by category pie chart
  const categoryData = useMemo(() => {
    const categories = new Map();
    
    filteredTransactions
      .filter(t => t.operação === 'saída')
      .forEach(transaction => {
        const category = transaction.categoria || 'Sem categoria';
        
        if (!categories.has(category)) {
          categories.set(category, { 
            name: category, 
            value: 0 
          });
        }
        
        const categoryData = categories.get(category);
        categoryData.value += Number(transaction.valor);
      });
    
    return Array.from(categories.values())
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

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
}
