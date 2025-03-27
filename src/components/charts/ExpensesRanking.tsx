
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExpensesRankingData } from './hooks/useExpensesRankingData';
import { EmptyRankingMessage } from './ranking/EmptyRankingMessage';
import { RankingCategoryItem } from './ranking/RankingCategoryItem';

interface ExpensesRankingProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  transactionType: 'entrada' | 'saída';
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string | null;
}

export function ExpensesRanking({ 
  data, 
  transactionType,
  onCategoryClick,
  selectedCategory
}: ExpensesRankingProps) {
  const { 
    hasData, 
    dataToShow, 
    totalValue, 
    showMoreMessage, 
    totalCategories 
  } = useExpensesRankingData(data, transactionType);
  
  if (!hasData) {
    return <EmptyRankingMessage transactionType={transactionType} />;
  }

  // Determine text color based on transaction type
  const valueTextColor = transactionType === 'saída' ? 'text-expense' : 'text-income';

  return (
    <div className="flex flex-col h-[290px]">
      {/* Scrollable categories area */}
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {dataToShow.map((category, index) => (
            <RankingCategoryItem
              key={index}
              name={category.name}
              value={category.value}
              index={index}
              transactionType={transactionType}
              onCategoryClick={onCategoryClick}
              isSelected={selectedCategory === category.name}
            />
          ))}
          
          {/* Show the "more categories" message if needed */}
          {showMoreMessage && (
            <div className="text-center text-sm text-muted-foreground pt-2 pb-2">
              Mostrando 15 de {totalCategories} categorias
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Total sum row with a divider - always visible */}
      <div className="pt-2 mt-2 border-t-2 border-gray-300 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-card">
        <div className="flex items-center justify-between p-2">
          <span className="font-bold text-sm">
            Total {selectedCategory ? `(${selectedCategory})` : ''}
          </span>
          <span className={`font-bold ${valueTextColor}`}>
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
