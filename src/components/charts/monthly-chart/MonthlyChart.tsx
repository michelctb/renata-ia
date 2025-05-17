
import { useState } from 'react';
import {
  BarChart,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { MonthlyChartTooltip } from './MonthlyChartTooltip';
import { MonthlyChartBars } from './MonthlyChartBars';
import { MonthlyChartAxes } from './MonthlyChartAxes';
import { MonthlyChartEmpty } from './MonthlyChartEmpty';
import { MonthlyChartError } from './MonthlyChartError';
import { MonthlyChartFooter } from './MonthlyChartFooter';
import { useMonthlyChartDimensions } from '../hooks/useMonthlyChartDimensions';

interface MonthlyChartProps {
  data?: Array<{
    name: string;
    entrada: number;
    saída: number;
  }>;
  isEmpty?: boolean;
  mode?: 'all' | 'filtered';
}

export function MonthlyChart({ 
  data = [], 
  isEmpty = false, 
  mode = 'all' 
}: MonthlyChartProps) {
  const { width, height, margins, isMobile } = useMonthlyChartDimensions();
  const [hasError, setHasError] = useState(false);

  // Função segura para verificar se os dados são válidos
  const isDataValid = Array.isArray(data) && data.length > 0;
  
  if (hasError) {
    return <MonthlyChartError />;
  }
  
  if (isEmpty || !isDataValid) {
    return <MonthlyChartEmpty mode={mode} />;
  }

  // Garantir que os dados são uma array válida antes de renderizar o gráfico
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-[260px]">
        <BarChart
          width={width}
          height={height}
          data={safeData}
          margin={margins}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <MonthlyChartAxes isMobile={isMobile} />
          <Tooltip 
            content={<MonthlyChartTooltip />} 
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend 
            wrapperStyle={isMobile ? { fontSize: '10px', marginTop: '10px' } : { marginTop: '10px' }}
          />
          <MonthlyChartBars />
        </BarChart>
      </div>
      <MonthlyChartFooter />
    </div>
  );
}
