
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpensesPieChart } from './ExpensesPieChart';
import { ExpensesRanking } from './ranking/ExpensesRanking';
import { ChartSelector } from './ChartSelector';
import { PieChartIcon, BarChart3Icon } from 'lucide-react';

// Interface para os dados de categoria
interface CategoryData {
  name: string;
  value: number;
}

interface CategoryChartsContainerProps {
  categoryData: CategoryData[];
  transactionType: 'saída' | 'entrada';
  setTransactionType: (value: 'saída' | 'entrada') => void;
  selectedCategory?: string | null;
  onCategoryClick?: (category: string) => void;
}

export function CategoryChartsContainer({ 
  categoryData, 
  transactionType,
  setTransactionType,
  selectedCategory,
  onCategoryClick
}: CategoryChartsContainerProps) {
  const [selectedView, setSelectedView] = useState<'pie' | 'ranking'>('pie');
  
  // Título baseado no tipo de transação
  const chartTitle = transactionType === 'saída' ? 'Gastos por Categoria' : 'Receitas por Categoria';
  
  return (
    <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-2" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>{chartTitle}</CardTitle>
            <CardDescription>
              Distribuição de {transactionType === 'saída' ? 'despesas' : 'receitas'} por categoria
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {/* Toggle para alternar visualização: gráfico ou ranking */}
            <div className="flex items-center border rounded-md">
              <button 
                className={`p-1 ${selectedView === 'pie' ? 'bg-primary text-white' : 'bg-transparent'} rounded-l-md`}
                onClick={() => setSelectedView('pie')}
                title="Visualizar como gráfico"
              >
                <PieChartIcon className="h-5 w-5" />
              </button>
              <button 
                className={`p-1 ${selectedView === 'ranking' ? 'bg-primary text-white' : 'bg-transparent'} rounded-r-md`}
                onClick={() => setSelectedView('ranking')}
                title="Visualizar como ranking"
              >
                <BarChart3Icon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Seletor para alternar entre entradas e saídas */}
            <ChartSelector 
              transactionType={transactionType} 
              setTransactionType={setTransactionType}
              selectedView={selectedView}
              setSelectedView={setSelectedView}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Conteúdo alternado entre gráfico e ranking */}
        <div className="h-[300px] flex flex-col">
          {selectedView === 'pie' ? (
            <ExpensesPieChart 
              data={categoryData} 
              transactionType={transactionType} 
              onCategoryClick={onCategoryClick}
              selectedCategory={selectedCategory}
            />
          ) : (
            <ExpensesRanking 
              data={categoryData} 
              transactionType={transactionType}
              onCategoryClick={onCategoryClick}
              selectedCategory={selectedCategory}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
