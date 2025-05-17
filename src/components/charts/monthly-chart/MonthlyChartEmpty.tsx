
interface MonthlyChartEmptyProps {
  mode: 'all' | 'filtered';
}

export function MonthlyChartEmpty({ mode }: MonthlyChartEmptyProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
      <p className="mb-2">
        {mode === 'filtered' 
          ? "Sem dados para o período filtrado" 
          : "Sem dados para exibir"}
      </p>
      <p className="text-sm text-gray-500">
        {mode === 'filtered' 
          ? "Tente selecionar outro período ou alternar para a visualização completa" 
          : "Tente adicionar transações"}
      </p>
    </div>
  );
}
