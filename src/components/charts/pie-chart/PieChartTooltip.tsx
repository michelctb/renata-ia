
import { formatCurrency } from '@/lib/utils';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
    };
  }>;
}

export function PieChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;
  return (
    <div className="bg-white p-2 border rounded shadow-md dark:bg-gray-800 dark:border-gray-700">
      <p className="font-medium">{data.name}</p>
      <p className="text-primary">{formatCurrency(data.value)}</p>
    </div>
  );
}
