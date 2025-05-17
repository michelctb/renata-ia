
interface MonthlyChartFooterProps {
  selectedMonth: string | null;
  isMobile: boolean;
}

export function MonthlyChartFooter({ selectedMonth, isMobile }: MonthlyChartFooterProps) {
  return (
    <div className="text-xs text-muted-foreground text-right pr-2 mt-2 absolute bottom-2 right-2">
      {selectedMonth 
        ? `Filtro aplicado: ${selectedMonth} (clique novamente para remover)` 
        : isMobile ? 'Toque para filtrar' : 'Clique em um mês para filtrar'}
    </div>
  );
}
