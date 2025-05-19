
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
  
  // Verificar se o mês está dentro do intervalo de filtro
  const isInDateRange = payload[0]?.payload?.isInDateRange;

  return (
    <Card className="border border-border/50 shadow-md bg-background p-0">
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <p className="font-bold text-sm mb-1">{label}</p>
          {isInDateRange !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${isInDateRange ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
              {isInDateRange ? 'No filtro' : 'Fora do filtro'}
            </span>
          )}
        </div>
        
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
