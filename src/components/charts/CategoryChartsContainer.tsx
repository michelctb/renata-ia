
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartSelector } from './ChartSelector';
import { ExpensesPieChart } from './ExpensesPieChart';
import { ExpensesRanking } from './ExpensesRanking';

interface CategoryChartsContainerProps {
  categoryData: {
    data: Array<{
      name: string;
      value: number;
      goalValue?: number;
    }>;
    goalValues?: Record<string, number>;
  };
  transactionType: 'saída' | 'entrada';
  setTransactionType: (type: 'saída' | 'entrada') => void;
  onCategoryClick?: (category: string) => void;
}

export function CategoryChartsContainer({
  categoryData,
  transactionType,
  setTransactionType,
  onCategoryClick
}: CategoryChartsContainerProps) {
  // Chart type selector state (pie chart or ranking)
  const [selectedView, setSelectedView] = useState<'pie' | 'ranking'>('pie');

  const chartTitle = transactionType === 'saída' ? 'Gastos por Categoria' : 'Receitas por Categoria';

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 border-none shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{chartTitle}</CardTitle>
          <ChartSelector
            transactionType={transactionType}
            setTransactionType={setTransactionType}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
        </div>
      </CardHeader>
      <CardContent className="p-2">
        {selectedView === 'pie' ? (
          <ExpensesPieChart data={categoryData.data} transactionType={transactionType} />
        ) : (
          <ExpensesRanking 
            data={categoryData.data} 
            transactionType={transactionType} 
            onCategoryClick={onCategoryClick}
          />
        )}
      </CardContent>
    </Card>
  );
}
