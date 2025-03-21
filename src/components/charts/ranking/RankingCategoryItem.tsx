
import { formatCurrency } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { RANKING_COLORS } from '../hooks/useExpensesRankingData';

interface RankingCategoryItemProps {
  name: string;
  value: number;
  index: number;
  transactionType: 'entrada' | 'saída';
}

export const RankingCategoryItem = ({ name, value, index, transactionType }: RankingCategoryItemProps) => {
  // Determine text color based on transaction type
  const valueTextColor = transactionType === 'saída' ? 'text-expense' : 'text-income';
  
  return (
    <div className="flex items-center justify-between p-2 border-b">
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
  );
};
