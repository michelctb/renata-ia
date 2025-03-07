
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#F4D03F', '#EC7063'];

interface ExpensesRankingProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function ExpensesRanking({ data }: ExpensesRankingProps) {
  if (data.length === 0) {
    return (
      <div className="h-[290px] flex items-center justify-center text-muted-foreground">
        Sem dados de saída para exibir no período selecionado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((category, index) => (
        <div key={index} className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium truncate max-w-[120px]">
              {category.name}
            </span>
          </div>
          <span className="text-expense font-medium">
            {formatCurrency(category.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
