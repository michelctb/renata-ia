
import { formatCurrency } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { RANKING_COLORS } from '../hooks/useExpensesRankingData';

interface RankingCategoryItemProps {
  name: string;
  value: number;
  index: number;
  transactionType: 'entrada' | 'saída';
  goalValue?: number;
  onClick?: (category: string) => void;
}

export const RankingCategoryItem = ({ 
  name, 
  value, 
  index, 
  transactionType,
  goalValue,
  onClick
}: RankingCategoryItemProps) => {
  // Determine text color based on transaction type
  const valueTextColor = transactionType === 'saída' ? 'text-expense' : 'text-income';
  
  return (
    <div 
      className="flex flex-col p-2 border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
      onClick={() => onClick?.(name)}
    >
      <div className="flex items-center justify-between">
        <Badge 
          className="font-medium truncate max-w-[140px] text-sm text-white" 
          style={{ 
            backgroundColor: RANKING_COLORS[index % RANKING_COLORS.length],
            borderColor: RANKING_COLORS[index % RANKING_COLORS.length] 
          }}
          title={name}
        >
          {name}
        </Badge>
        <span className={`font-medium ${valueTextColor}`}>
          {formatCurrency(value)}
        </span>
      </div>
      
      {goalValue && goalValue > 0 && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-muted-foreground">
            Meta: {formatCurrency(goalValue)}
          </span>
        </div>
      )}
    </div>
  );
};
