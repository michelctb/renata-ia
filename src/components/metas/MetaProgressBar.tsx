
import { Progress } from "@/components/ui/progress";

interface MetaProgressBarProps {
  valor: number;  // valor entre 0 e 1 (ou maior para excedido)
  status: 'baixo' | 'médio' | 'alto' | 'excedido';
}

export function MetaProgressBar({ valor, status }: MetaProgressBarProps) {
  // Limitar o valor a 100% para a barra, mesmo se exceder
  const valorExibicao = Math.min(valor * 100, 100);
  
  // Definir cores com base no status
  const getProgressColor = () => {
    switch (status) {
      case 'baixo':
        return 'bg-green-500';
      case 'médio':
        return 'bg-yellow-500';
      case 'alto':
        return 'bg-orange-500';
      case 'excedido':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };
  
  // Texto de porcentagem
  const porcentagemTexto = `${Math.round(valor * 100)}%`;
  
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{porcentagemTexto}</span>
        {status === 'excedido' && (
          <span className="text-red-500 font-medium">Excedido</span>
        )}
      </div>
      <Progress
        value={valorExibicao}
        className="h-2"
        indicatorClassName={getProgressColor()}
      />
    </div>
  );
}
