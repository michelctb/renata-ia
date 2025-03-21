
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useProcessPieChartData } from './hooks/useProcessPieChartData';
import { PieChartTooltip } from './pie-chart/PieChartTooltip';
import { PieChartLabel } from './pie-chart/PieChartLabel';
import { PieChartLegend } from './pie-chart/PieChartLegend';
import { EmptyChartMessage } from './pie-chart/EmptyChartMessage';

interface ExpensesPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  transactionType: 'entrada' | 'saída';
}

export function ExpensesPieChart({ data, transactionType }: ExpensesPieChartProps) {
  const { hasData, processedData, renderColors } = useProcessPieChartData(data, transactionType);
  
  if (!hasData) {
    return <EmptyChartMessage transactionType={transactionType} />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={PieChartLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={renderColors[index % renderColors.length]} />
          ))}
        </Pie>
        <Tooltip content={<PieChartTooltip />} />
        <Legend content={<PieChartLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
