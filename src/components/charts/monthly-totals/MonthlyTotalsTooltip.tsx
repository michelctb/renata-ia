
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface MonthlyTotalsTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function MonthlyTotalsTooltip({ active, payload, label }: MonthlyTotalsTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Obter dados do payload
  const entradas = payload.find(p => p.dataKey === 'entradas')?.value || 0;
  const saidas = payload.find(p => p.dataKey === 'saidas')?.value || 0;
  const saldo = payload.find(p => p.dataKey === 'saldo')?.value || entradas - saidas;

  return (
    <Card className="border border-border/50 shadow-md bg-background p-0">
      <CardContent className="p-3">
        <p className="font-bold text-sm mb-1">{label}</p>
        
        <div className="grid gap-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-green-500 flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
              Entradas:
            </span>
            <span className="font-mono font-medium">{formatCurrency(entradas)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-red-500 flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
              Saídas:
            </span>
            <span className="font-mono font-medium">{formatCurrency(saidas)}</span>
          </div>
          
          <div className="flex justify-between items-center border-t border-border/50 mt-1 pt-1">
            <span className="text-blue-500 flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
              Saldo:
            </span>
            <span className={`font-mono font-medium ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(saldo)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
