
import { formatCurrency } from '@/lib/utils';
import { TooltipProps } from 'recharts';

export const PieChartTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
        <p className="font-medium">{payload[0].name}</p>
        <p style={{ color: payload[0].color }}>
          {formatCurrency(payload[0].value as number)}
        </p>
      </div>
    );
  }
  return null;
};
