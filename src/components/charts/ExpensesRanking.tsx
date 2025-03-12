
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

  // Show only top categories if there are too many
  const dataToShow = data.slice(0, 10); // Show at most 10 categories

  return (
    <div className="space-y-2 max-h-[320px] overflow-y-auto">
      {dataToShow.map((category, index) => (
        <div key={index} className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium truncate max-w-[120px] text-sm" title={category.name}>
              {category.name}
            </span>
          </div>
          <span className="text-expense font-medium">
            {formatCurrency(category.value)}
          </span>
        </div>
      ))}
      {data.length > 10 && (
        <div className="text-center text-sm text-muted-foreground pt-2">
          Mostrando 10 de {data.length} categorias
        </div>
      )}
    </div>
  );
}
