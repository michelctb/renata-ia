
import { XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface MonthlyChartAxesProps {
  isMobile: boolean;
}

export function MonthlyChartAxes({ 
  isMobile
}: MonthlyChartAxesProps) {
  return (
    <>
      <XAxis 
        dataKey="name" 
        tick={{ fontSize: isMobile ? 10 : 12 }}
        height={40}
      />
      <YAxis
        tickFormatter={(value) => formatCurrency(value)}
        tick={{ fontSize: isMobile ? 10 : 12 }}
        width={isMobile ? 40 : 60}
      />
    </>
  );
}
