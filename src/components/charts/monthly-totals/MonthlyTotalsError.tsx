
import { AlertCircleIcon } from "lucide-react";

interface MonthlyTotalsErrorProps {
  message?: string;
}

export function MonthlyTotalsError({ message = "Erro ao carregar os dados do gráfico" }: MonthlyTotalsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] bg-background/50 rounded-md p-4 border border-dashed border-red-200">
      <div className="text-red-500 p-3 rounded-full bg-red-50">
        <AlertCircleIcon className="h-6 w-6" />
      </div>
      <h4 className="mt-3 font-medium text-red-700">Ocorreu um erro</h4>
      <p className="text-sm text-red-500 text-center max-w-[220px] mt-1">
        {message}
      </p>
    </div>
  );
}
