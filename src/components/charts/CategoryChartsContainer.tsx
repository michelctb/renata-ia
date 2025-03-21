
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpensesPieChart } from './ExpensesPieChart';
import { ExpensesRanking } from './ExpensesRanking';
import { ChartSelector } from './ChartSelector';

interface CategoryChartsContainerProps {
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  transactionType: 'saída' | 'entrada';
  setTransactionType: (value: 'saída' | 'entrada') => void;
}

export function CategoryChartsContainer({ 
  categoryData, 
  transactionType,
  setTransactionType
}: CategoryChartsContainerProps) {
  const chartTitle = transactionType === 'saída' ? 'Saídas por Categoria' : 'Entradas por Categoria';
  const rankingTitle = transactionType === 'saída' ? 'Ranking de Categorias (Saídas)' : 'Ranking de Categorias (Entradas)';
  const chartDescription = transactionType === 'saída' 
    ? 'Distribuição de gastos por categoria no período' 
    : 'Distribuição de receitas por categoria no período';
  const rankingDescription = transactionType === 'saída' 
    ? 'Maiores gastos por categoria no período' 
    : 'Maiores receitas por categoria no período';

  return (
    <>
      <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-2" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <div>
            <CardTitle>{chartTitle}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </div>
          <ChartSelector
            transactionType={transactionType}
            setTransactionType={setTransactionType}
          />
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
    </>
  );
}
