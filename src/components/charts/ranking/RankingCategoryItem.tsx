
import { formatCurrency } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { RANKING_COLORS } from '../hooks/useExpensesRankingData';

interface RankingCategoryItemProps {
  name: string;
  value: number;
  index: number;
  transactionType: 'entrada' | 'saída';
  onCategoryClick?: (category: string) => void;
  isSelected?: boolean;
}

export const RankingCategoryItem = ({ 
  name, 
  value, 
  index, 
  transactionType,
  onCategoryClick,
  isSelected = false
}: RankingCategoryItemProps) => {
  // Determine text color based on transaction type
  const valueTextColor = transactionType === 'saída' ? 'text-expense' : 'text-income';
  
  // Handler para o clique na categoria
  const handleClick = () => {
    if (onCategoryClick) {
      onCategoryClick(name);
    }
  };
  
  // Estilo para item selecionado
  const selectedStyle = isSelected ? 
    'ring-2 ring-primary ring-offset-1 bg-primary/5 dark:bg-primary/10' : '';
  
  return (
    <div 
      className={`flex items-center justify-between p-2 border-b ${onCategoryClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''} ${selectedStyle}`}
      onClick={onCategoryClick ? handleClick : undefined}
      title={onCategoryClick ? `Clique para filtrar por ${name}` : name}
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
