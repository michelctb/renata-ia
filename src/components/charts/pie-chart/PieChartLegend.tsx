
import { Badge } from "@/components/ui/badge";

export const PieChartLegend = ({ payload, selectedCategory }: any) => {
  if (!payload || !payload.length) return null;

  return (
    <div className="flex flex-wrap justify-center mt-2 gap-x-2 gap-y-2">
      {payload.map((entry: any, index: number) => {
        const isSelected = selectedCategory === entry.payload.name;
        
        return (
          <Badge 
            key={`item-${index}`}
            className={`font-medium truncate text-sm text-white ${isSelected ? 'font-bold ring-2 ring-white ring-offset-1' : ''}`}
            style={{ 
              backgroundColor: entry.color,
              borderColor: entry.color
            }}
            title={entry.payload.name}
          >
            {entry.payload.name}
          </Badge>
        );
      })}
    </div>
  );
};
