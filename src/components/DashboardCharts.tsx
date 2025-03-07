
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { format, parse, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from 'recharts';

type DashboardChartsProps = {
  transactions: Transaction[];
  dateRange: DateRange | null;
};

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#F4D03F', '#EC7063'];

const DashboardCharts = ({ transactions, dateRange }: DashboardChartsProps) => {
  // Filter transactions by date range - usando a coluna 'data' conforme solicitado
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
    
    // Convert map to array and sort by date
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
    
    // Convert map to array and sort by value (descending)
    return Array.from(categories.values())
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value as number)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p style={{ color: payload[0].color }}>
            {formatCurrency(payload[0].value as number)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const item = categoryData[index];
    if (percent < 0.05) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Bar Chart for Monthly Income/Expenses */}
      <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-3" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-2">
          <CardTitle>Entradas e Saídas por Mês</CardTitle>
          <CardDescription>Visualização mensal de valores recebidos e pagos</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value).split(',')[0]} 
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                <Bar dataKey="entrada" name="Entradas" fill="#4ade80" />
                <Bar dataKey="saída" name="Saídas" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Sem dados para exibir no período selecionado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart for Expenses by Category */}
      <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-2" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-2">
          <CardTitle>Saídas por Categoria</CardTitle>
          <CardDescription>Distribuição de gastos por categoria no período</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomPieLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Sem dados de saída para exibir no período selecionado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranking de Categorias de Saída */}
      <Card className="border-none shadow-md animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="pb-2">
          <CardTitle>Ranking de Categorias</CardTitle>
          <CardDescription>Maiores gastos por categoria no período</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium truncate max-w-[120px]">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-expense font-medium">
                    {formatCurrency(category.value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[290px] flex items-center justify-center text-muted-foreground">
              Sem dados de saída para exibir no período selecionado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
