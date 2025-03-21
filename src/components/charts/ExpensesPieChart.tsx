
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyChartMessage } from './pie-chart/EmptyChartMessage';
import { PieChartTooltip } from './pie-chart/PieChartTooltip';
import { PieChartLegend } from './pie-chart/PieChartLegend';
import { useProcessPieChartData } from './hooks/useProcessPieChartData';

interface ChartData {
  name: string;
  value: number;
}

interface ExpensesPieChartProps {
  data: ChartData[];
  transactionType: 'saída' | 'entrada'; 
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string | null;
}

// We need to explicitly add Recharts custom props that aren't in the type definitions
interface CustomCellProps {
  onClick?: () => void;
  style?: {
    cursor: string;
  };
}

export function ExpensesPieChart({ 
  data, 
  transactionType,
  onCategoryClick,
  selectedCategory
}: ExpensesPieChartProps) {
  const { 
    processedData, 
    hasData, 
    totalValue, 
    COLORS, 
    RADIAN, 
    otherCategories 
  } = useProcessPieChartData(data);
  
  // Renderizar componente vazio se não houver dados
  if (!hasData) {
    return <EmptyChartMessage transactionType={transactionType} />;
  }
  
  // Determinar opacidade dos itens com base na categoria selecionada
  const getOpacity = (name: string) => {
    if (!selectedCategory) return 1;
    return name === selectedCategory ? 1 : 0.3;
  };
  
  // Determinar offset para destacar a categoria selecionada
  const getOffset = (name: string) => {
    if (!selectedCategory) return 0;
    return name === selectedCategory ? 10 : 0;
  };
  
  // Determinar cursor
  const getCursor = () => {
    return onCategoryClick ? 'pointer' : 'default';
  };
  
  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={1}
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="#fff"
                opacity={getOpacity(entry.name)}
                strokeWidth={1}
                // Adicionando propriedades para interatividade
                {...{
                  onClick: onCategoryClick ? () => onCategoryClick(entry.name) : undefined,
                  style: { cursor: getCursor() },
                  // @ts-ignore - Propriedade personalizada que não está na definição de tipos
                  x: getOffset(entry.name)
                } as CustomCellProps}
              />
            ))}
          </Pie>
          <Tooltip content={<PieChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <PieChartLegend 
        data={processedData} 
        colors={COLORS} 
        totalValue={totalValue} 
        transactionType={transactionType}
        onClick={onCategoryClick}
        selectedCategory={selectedCategory}
      />
      
      {/* Exibir categorias agrupadas */}
      {otherCategories.length > 0 && (
        <div className="text-xs text-muted-foreground absolute bottom-0 left-0 right-0 text-center">
          *Outras: {otherCategories.map(c => c.name).join(', ')}
        </div>
      )}
    </div>
  );
}
