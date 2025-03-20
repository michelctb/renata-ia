import { formatCurrency } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Badge } from "@/components/ui/badge";

// Expanded color palette for the pie chart
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', 
  '#5DADE2', '#F4D03F', '#EC7063', '#45B39D', '#AF7AC5', 
  '#5499C7', '#F5B041', '#EB984E', '#58D68D', '#3498DB',
  '#1ABC9C', '#9B59B6', '#2ECC71', '#E67E22', '#E74C3C',
  '#34495E', '#16A085', '#27AE60', '#8E44AD', '#F39C12'
];

// Define a catch-all color for "other" categories
const OTHER_COLOR = '#95A5A6';

interface ExpensesPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  transactionType: 'entrada' | 'saída';
}

// Custom tooltip for pie chart
const CustomPieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
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

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Only show percentage label if it's significant (greater than 5%)
  if (percent < 0.05) return null;
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom legend component that uses badges instead of dots
const CustomLegend = (props: any) => {
  const { payload } = props;
  
  if (!payload || payload.length === 0) return null;
  
  return (
    <div className="flex flex-wrap justify-center gap-2 pt-4">
      {payload.map((entry: any, index: number) => (
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

export function ExpensesPieChart({ data, transactionType }: ExpensesPieChartProps) {
  console.log(`Raw data received in pie chart (${transactionType}):`, data);
  
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        {transactionType === 'saída' 
          ? 'Sem dados de saída para exibir no período selecionado'
          : 'Sem dados de entrada para exibir no período selecionado'
        }
      </div>
    );
  }

  // Process the data to group small categories as "Outros" if there are too many categories
  const processedData = (() => {
    if (data.length <= 10) return data;
    
    // Sort by value (highest first)
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    
    // Take top 9 categories
    const topCategories = sortedData.slice(0, 9);
    
    // Group the rest as "Outros"
    const otherCategories = sortedData.slice(9);
    const otherSum = otherCategories.reduce((sum, category) => sum + category.value, 0);
    
    if (otherSum > 0) {
      return [
        ...topCategories,
        {
          name: `Outros (${otherCategories.length})`,
          value: otherSum
        }
      ];
    }
    
    return topCategories;
  })();

  console.log(`Processed data for pie chart (${transactionType}):`, processedData);

  // Ensure we have enough colors
  const renderColors = [...COLORS];
  // If we have an "Outros" category, use a specific color for it
  if (processedData.length > 9) {
    renderColors[9] = OTHER_COLOR;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={CustomPieLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={renderColors[index % renderColors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
