
import { Bar } from 'recharts';

export function MonthlyChartBars() {
  return (
    <>
      <Bar 
        dataKey="entrada" 
        name="Entradas" 
        fill="#4ade80" 
        isAnimationActive={false}
      />
      <Bar 
        dataKey="saída" 
        name="Saídas" 
        fill="#f87171" 
        isAnimationActive={false}
      />
    </>
  );
}
