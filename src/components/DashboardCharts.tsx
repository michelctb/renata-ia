
import { useMemo, useState } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyChart } from './charts/MonthlyChart';
import { ExpensesPieChart } from './charts/ExpensesPieChart';
import { ExpensesRanking } from './charts/ExpensesRanking';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type DashboardChartsProps = {
  transactions: Transaction[];
  dateRange: DateRange | null;
};

export default function DashboardCharts({ transactions, dateRange }: DashboardChartsProps) {
  const [transactionType, setTransactionType] = useState<'saída' | 'entrada'>('saída');
  
  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    if (!dateRange || !dateRange.from) return transactions;
    
    console.log(`Filtering chart data with date range: ${dateRange.from.toISOString()} to ${dateRange.to?.toISOString() || 'none'}`);
    
    return transactions.filter(transaction => {
      try {
        // Parse the date directly from ISO string
        const transactionDateStr = transaction.data;
        const transactionDate = parseISO(transactionDateStr);
        
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
      } catch (error) {
        console.error('Error parsing date for charts:', transaction.data, error);
        return false;
      }
    });
  }, [transactions, dateRange]);

  // Prepare data for monthly income/expense bar chart
  const monthlyData = useMemo(() => {
    const months = new Map();
    
    filteredTransactions.forEach(transaction => {
      try {
        // Parse the date directly
        const dateStr = transaction.data;
        const date = parseISO(dateStr);
        
        const monthKey = format(date, 'yyyy-MM');
        const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
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
        } else if (operationType === 'saída' || operationType === 'saida') {
          monthData.saída += Number(transaction.valor);
        }
      } catch (error) {
        console.error('Error processing date for monthly chart:', transaction.data, error);
      }
    });
    
    return Array.from(months.values())
      .sort((a, b) => {
        // Fix the Month type error by correctly parsing the month names to dates
        const getMonthNumber = (monthName: string) => {
          const months = {
            'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
            'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11
          };
          return months[monthName.toLowerCase().substring(0, 3)] || 0;
        };
        
        const [monthA, yearA] = a.name.split(' ');
        const [monthB, yearB] = b.name.split(' ');
        
        const yearDiff = parseInt(yearA) - parseInt(yearB);
        if (yearDiff !== 0) return yearDiff;
        
        return getMonthNumber(monthA) - getMonthNumber(monthB);
      });
  }, [filteredTransactions]);

  // Prepare data for expenses or income by category pie chart
  const categoryData = useMemo(() => {
    const categories = new Map();
    
    // Process transactions based on selected transaction type with case-insensitive check
    filteredTransactions
      .filter(t => {
        const opType = t.operação?.toLowerCase() || '';
        return opType === transactionType || opType === transactionType.replace('í', 'i');
      })
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
  }, [filteredTransactions, transactionType]);

  const chartTitle = transactionType === 'saída' ? 'Saídas por Categoria' : 'Entradas por Categoria';
  const rankingTitle = transactionType === 'saída' ? 'Ranking de Categorias (Saídas)' : 'Ranking de Categorias (Entradas)';
  const chartDescription = transactionType === 'saída' 
    ? 'Distribuição de gastos por categoria no período' 
    : 'Distribuição de receitas por categoria no período';
  const rankingDescription = transactionType === 'saída' 
    ? 'Maiores gastos por categoria no período' 
    : 'Maiores receitas por categoria no período';

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
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <div>
            <CardTitle>{chartTitle}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </div>
          <ToggleGroup type="single" value={transactionType} onValueChange={(value) => value && setTransactionType(value as 'saída' | 'entrada')}>
            <ToggleGroupItem value="saída" aria-label="Mostrar saídas" className={transactionType === 'saída' ? 'bg-expense text-white hover:text-white' : ''}>
              Saídas
            </ToggleGroupItem>
            <ToggleGroupItem value="entrada" aria-label="Mostrar entradas" className={transactionType === 'entrada' ? 'bg-income text-white hover:text-white' : ''}>
              Entradas
            </ToggleGroupItem>
          </ToggleGroup>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ExpensesPieChart data={categoryData} transactionType={transactionType} />
        </CardContent>
      </Card>

      <Card className="border-none shadow-md animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="pb-2">
          <CardTitle>{rankingTitle}</CardTitle>
          <CardDescription>{rankingDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpensesRanking data={categoryData} transactionType={transactionType} />
        </CardContent>
      </Card>
    </div>
  );
};
