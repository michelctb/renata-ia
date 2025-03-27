
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
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string | null;
}

export function ExpensesPieChart({ 
  data, 
  transactionType,
  onCategoryClick,
  selectedCategory
}: ExpensesPieChartProps) {
  const { hasData, processedData, renderColors } = useProcessPieChartData(data, transactionType);
  
  // Debug de dados
  console.log('ExpensesPieChart - dados recebidos:', data);
  console.log('ExpensesPieChart - hasData:', hasData);
  console.log('ExpensesPieChart - dados processados:', processedData);
  
  if (!hasData || processedData.length === 0) {
    return <EmptyChartMessage transactionType={transactionType} />;
  }

  // Função para lidar com o clique em uma fatia do gráfico
  const handlePieClick = (data: any) => {
    console.log('Clique no gráfico de pizza:', data);
    if (onCategoryClick && data && data.name) {
      onCategoryClick(data.name);
    }
  };

  // Mensagem no topo para indicar a interatividade
  const interactiveMessage = (
    <div className="text-xs text-center text-muted-foreground mb-2">
      {selectedCategory 
        ? `Filtro aplicado: ${selectedCategory} (clique novamente para remover)` 
        : 'Clique em uma categoria para filtrar'}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {onCategoryClick && interactiveMessage}
      <ResponsiveContainer width="100%" height={onCategoryClick ? "calc(100% - 20px)" : "100%"}>
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
            onClick={onCategoryClick ? handlePieClick : undefined}
            cursor={onCategoryClick ? "pointer" : "default"}
            // Destacar a fatia selecionada
            activeIndex={selectedCategory ? processedData.findIndex(item => item.name === selectedCategory) : undefined}
            activeShape={(props) => {
              // Apenas retorna o mesmo shape, mas com uma animação de escala
              return {
                ...props,
                innerRadius: 5, // adiciona um pequeno espaço interno
                opacity: 0.8 // deixa um pouco mais transparente
              };
            }}
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={renderColors[index % renderColors.length]} 
                // Aplica um estilo de destaque para a categoria selecionada
                stroke={entry.name === selectedCategory ? "#000" : "none"}
                strokeWidth={entry.name === selectedCategory ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip content={<PieChartTooltip />} />
          <Legend content={<PieChartLegend selectedCategory={selectedCategory} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
