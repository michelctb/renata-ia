
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LegendProps {
  data: { name: string; value: number }[];
  colors: string[];
  totalValue: number;
  transactionType: 'saída' | 'entrada';
  onClick?: (category: string) => void;
  selectedCategory?: string | null;
}

export function PieChartLegend({ 
  data, 
  colors, 
  totalValue, 
  transactionType,
  onClick,
  selectedCategory
}: LegendProps) {
  const valueColor = transactionType === 'saída' ? 'text-expense' : 'text-income';
  
  // Definir estilo de cursor com base na existência de onClick
  const cursorStyle = onClick ? 'cursor-pointer' : 'cursor-default';
  
  // Definir estilo de item selecionado
  const getSelectedStyle = (name: string) => {
    return selectedCategory === name ? 'bg-gray-100 dark:bg-gray-800' : '';
  };
  
  // Manipular clique em categoria
  const handleCategoryClick = (category: string) => {
    if (onClick) {
      onClick(category);
    }
  };
  
  return (
    <div className="mt-4 absolute right-0 top-[50%] transform translate-y-[-50%] w-[40%]">
      <ScrollArea className="h-[200px]">
        <div className="space-y-1 pr-2">
          {data.map((entry, index) => (
            <div 
              key={`legend-${index}`} 
              className={`flex items-center justify-between text-xs ${cursorStyle} ${getSelectedStyle(entry.name)} p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800`}
              onClick={() => handleCategoryClick(entry.name)}
              title={onClick ? `Filtrar por ${entry.name}` : undefined}
            >
              <div className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length], opacity: selectedCategory && selectedCategory !== entry.name ? 0.3 : 1 }}
                />
                <span className="truncate max-w-[80px]" title={entry.name}>{entry.name}</span>
              </div>
              <span className={valueColor}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-2 text-right text-xs border-t pt-1">
        <span className="font-medium">Total:</span>{' '}
        <span className={`font-medium ${valueColor}`}>
          {formatCurrency(totalValue)}
        </span>
      </div>
    </div>
  );
}
