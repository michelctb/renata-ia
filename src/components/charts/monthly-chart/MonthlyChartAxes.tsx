
import { XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface MonthlyChartAxesProps {
  selectedMonth?: string | null;
  isMobile: boolean;
}

export function MonthlyChartAxes({ selectedMonth, isMobile }: MonthlyChartAxesProps) {
  return (
    <>
      <XAxis 
        dataKey="name" 
        tick={(props: any) => {
          // Verificar se props é válido
          if (!props || !props.payload || !props.payload.value) {
            return null;
          }
          
          // Destacar o mês selecionado
          const isSelected = selectedMonth === props.payload.value;
          return (
            <text
              x={props.x}
              y={props.y}
              dy={16}
              textAnchor="middle"
              fill={isSelected ? '#3b82f6' : 'currentColor'}
              fontWeight={isSelected ? 'bold' : 'normal'}
              fontSize={isMobile ? 10 : 12}
            >
              {props.payload.value}
            </text>
          );
        }}
        height={30}
        interval={isMobile ? 1 : 0}
      />
      <YAxis 
        tickFormatter={(value) => isMobile ? 
          `${value/1000}k` : 
          formatCurrency(value).split(',')[0]} 
        width={isMobile ? 30 : undefined}
        fontSize={isMobile ? 10 : 12}
      />
    </>
  );
}
