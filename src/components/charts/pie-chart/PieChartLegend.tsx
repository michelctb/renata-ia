
import { formatCurrency } from '@/lib/utils';

export const PieChartLegend = ({ payload, selectedCategory }: any) => {
  if (!payload || !payload.length) return null;

  return (
    <ul className="flex flex-wrap justify-center mt-2 gap-x-4 gap-y-1">
      {payload.map((entry: any, index: number) => {
        const isSelected = selectedCategory === entry.payload.name;
        
        return (
          <li 
            key={`item-${index}`} 
            className={`flex items-center text-xs ${isSelected ? 'font-bold' : ''}`}
            style={{ color: isSelected ? entry.color : 'inherit' }}
          >
            <span 
              className="inline-block w-3 h-3 mr-1" 
              style={{ 
                backgroundColor: entry.color,
                border: isSelected ? `2px solid ${entry.color}` : 'none',
                boxShadow: isSelected ? '0 0 0 1px white' : 'none'
              }}
            />
            <span className="mr-1">{entry.payload.name}:</span>
            <span className="font-medium">{formatCurrency(entry.payload.value)}</span>
          </li>
        );
      })}
    </ul>
  );
};
