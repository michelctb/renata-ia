
import { CalendarIcon } from "lucide-react";

export function MonthlyTotalsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-background/50 rounded-md p-4 border border-dashed border-border/50">
      <div className="text-muted-foreground p-3 rounded-full bg-muted/50">
        <CalendarIcon className="h-6 w-6" />
      </div>
      <h4 className="mt-3 font-medium">Sem dados para exibir</h4>
      <p className="text-sm text-muted-foreground text-center max-w-[220px] mt-1">
        Não há transações registradas para o período selecionado.
      </p>
    </div>
  );
}
