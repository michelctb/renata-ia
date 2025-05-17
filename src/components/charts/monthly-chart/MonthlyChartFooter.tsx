
import { useIsMobile } from '@/hooks/use-mobile';

export function MonthlyChartFooter() {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-xs text-muted-foreground text-right pr-2 mt-2 absolute bottom-2 right-2">
      {isMobile ? 'Visão geral por mês' : 'Visão geral de entradas e saídas por mês'}
    </div>
  );
}
