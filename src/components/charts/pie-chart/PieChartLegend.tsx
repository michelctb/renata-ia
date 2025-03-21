
import { Badge } from "@/components/ui/badge";

export interface PieChartLegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

export const PieChartLegend = ({ payload }: PieChartLegendProps) => {
  if (!payload || payload.length === 0) return null;
  
  return (
    <div className="flex flex-wrap justify-center gap-2 pt-4">
      {payload.map((entry, index) => (
        <Badge 
          key={`legend-${index}`}
          className="font-medium text-xs text-white" 
          style={{ 
            backgroundColor: entry.color,
            borderColor: entry.color
          }}
          title={entry.value}
        >
          {entry.value.length > 15 ? `${entry.value.substring(0, 15)}...` : entry.value}
        </Badge>
      ))}
    </div>
  );
};
