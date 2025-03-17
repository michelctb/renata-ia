
import { formatCurrency } from '@/lib/utils';

// Expanded color palette to match the pie chart
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', 
  '#5DADE2', '#F4D03F', '#EC7063', '#45B39D', '#AF7AC5', 
  '#5499C7', '#F5B041', '#EB984E', '#58D68D', '#3498DB',
  '#1ABC9C', '#9B59B6', '#2ECC71', '#E67E22', '#E74C3C',
  '#34495E', '#16A085', '#27AE60', '#8E44AD', '#F39C12'
];

interface ExpensesRankingProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  transactionType: 'entrada' | 'saída';
}

export function ExpensesRanking({ data, transactionType }: ExpensesRankingProps) {
  console.log(`Raw data received in ranking (${transactionType}):`, data);
  
  if (!data || data.length === 0) {
    return (
      <div className="h-[290px] flex items-center justify-center text-muted-foreground">
        {transactionType === 'saída' 
          ? 'Sem dados de saída para exibir no período selecionado'
          : 'Sem dados de entrada para exibir no período selecionado'
        }
      </div>
    );
  }

  // Show all categories sorted by value (highest first)
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // Show only top categories if there are too many
  const dataToShow = sortedData.slice(0, 15); // Show at most 15 categories

  // Calculate total of all displayed values
  const totalValue = dataToShow.reduce((sum, category) => sum + category.value, 0);

  console.log(`Processed data for ranking (${transactionType}):`, dataToShow);
  console.log(`Total value for ranking (${transactionType}):`, totalValue);

  // Determine text color based on transaction type
  const valueTextColor = transactionType === 'saída' ? 'text-expense' : 'text-income';

  return (
    <div className="space-y-2 max-h-[320px] overflow-y-auto">
      {dataToShow.map((category, index) => (
        <div key={index} className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium truncate max-w-[140px] text-sm" title={category.name}>
              {category.name}
            </span>
          </div>
          <span className={`font-medium ${valueTextColor}`}>
            {formatCurrency(category.value)}
          </span>
        </div>
      ))}
      
      {/* Show the "more categories" message if needed */}
      {data.length > 15 && (
        <div className="text-center text-sm text-muted-foreground pt-2">
          Mostrando 15 de {data.length} categorias
        </div>
      )}
      
      {/* Total sum row with a divider */}
      <div className="pt-2 mt-2 border-t-2 border-gray-300">
        <div className="flex items-center justify-between p-2">
          <span className="font-bold text-sm">Total</span>
          <span className={`font-bold ${valueTextColor}`}>
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
