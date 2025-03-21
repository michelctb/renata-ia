
import { formatCurrency } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { RANKING_COLORS } from '../hooks/useExpensesRankingData';

interface RankingCategoryItemProps {
  name: string;
  value: number;
  index: number;
  transactionType: 'entrada' | 'saída';
  onClick?: (category: string) => void;
  isSelected?: boolean;
}

export const RankingCategoryItem = ({ 
  name, 
  value, 
  index, 
  transactionType,
  onClick,
  isSelected = false
}: RankingCategoryItemProps) => {
  // Determine text color based on transaction type
  const valueTextColor = transactionType === 'saída' ? 'text-expense' : 'text-income';
  
  // Define cursor style based on whether onClick prop is provided
  const cursorStyle = onClick ? 'cursor-pointer' : 'cursor-default';
  
  // Define selected style
  const selectedStyle = isSelected ? 'bg-gray-100 dark:bg-gray-800' : '';
  
  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(name);
    }
  };
  
  return (
    <div 
      className={`flex items-center justify-between p-2 border-b ${cursorStyle} ${selectedStyle} hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
      onClick={handleClick}
      title={onClick ? `Filtrar por ${name}` : undefined}
    >
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
