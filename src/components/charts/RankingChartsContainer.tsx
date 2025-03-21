
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ExpensesRanking } from './ranking/ExpensesRanking';

// Interface para os dados de categoria
interface CategoryData {
  name: string;
  value: number;
}

interface RankingChartsContainerProps {
  categoryData: CategoryData[];
  transactionType: 'saída' | 'entrada';
  selectedCategory?: string | null;
  onCategoryClick?: (category: string) => void;
}

export function RankingChartsContainer({ 
  categoryData, 
  transactionType,
  selectedCategory,
  onCategoryClick
}: RankingChartsContainerProps) {
  // Título baseado no tipo de transação
  const chartTitle = transactionType === 'saída' ? 'Ranking de Gastos' : 'Ranking de Receitas';
  
  return (
    <Card className="border-none shadow-md animate-fade-up col-span-1" style={{ animationDelay: '0.3s' }}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>{chartTitle}</CardTitle>
            <CardDescription>
              Maiores {transactionType === 'saída' ? 'despesas' : 'receitas'} por categoria
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col">
          <ExpensesRanking 
            data={categoryData} 
            transactionType={transactionType}
            onCategoryClick={onCategoryClick}
            selectedCategory={selectedCategory}
          />
        </div>
      </CardContent>
    </Card>
  );
}
