
import { Bar } from 'recharts';
import { useCallback } from 'react';

interface MonthlyChartBarsProps {
  onMonthClick?: (month: string) => void;
}

export function MonthlyChartBars({ onMonthClick }: MonthlyChartBarsProps) {
  // Use useCallback para evitar recriação da função em cada render
  const handleBarClick = useCallback((data: any) => {
    console.log('MonthlyChart - Clique no mês:', data.name);
    if (onMonthClick && typeof onMonthClick === 'function') {
      onMonthClick(data.name);
    }
  }, [onMonthClick]);

  return (
    <>
      <Bar 
        dataKey="entrada" 
        name="Entradas" 
        fill="#4ade80" 
        onClick={onMonthClick ? handleBarClick : undefined}
        cursor={onMonthClick ? "pointer" : undefined}
        isAnimationActive={false}
      />
      <Bar 
        dataKey="saída" 
        name="Saídas" 
        fill="#f87171" 
        onClick={onMonthClick ? handleBarClick : undefined}
        cursor={onMonthClick ? "pointer" : undefined}
        isAnimationActive={false}
      />
    </>
  );
}
