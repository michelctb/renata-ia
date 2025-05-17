
interface MonthlyChartErrorProps {
  onReload?: () => void;
}

export function MonthlyChartError({ onReload }: MonthlyChartErrorProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-red-500">
      <p className="text-center">Erro ao renderizar o gráfico</p>
      <button 
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
        onClick={onReload || (() => window.location.reload())}
      >
        Recarregar página
      </button>
    </div>
  );
}
