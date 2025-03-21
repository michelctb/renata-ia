
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LIMITE_BAIXO, LIMITE_MEDIO, LIMITE_ALTO } from "@/lib/metas";

interface MetaProgressBarProps {
  valor_atual: number;
  valor_meta: number;
  porcentagem: number;
  status: 'baixo' | 'médio' | 'alto' | 'excedido';
}

export function MetaProgressBar({ 
  valor_atual, 
  valor_meta, 
  porcentagem, 
  status
}: MetaProgressBarProps) {
  // Formatar valores para exibição
  const valorAtualFormatado = valor_atual.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  const valorMetaFormatado = valor_meta.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  // Porcentagem formatada para exibição (limitada a 100% para a barra, mesmo se exceder)
  const porcentagemParaBarra = Math.min(porcentagem * 100, 100);
  const porcentagemFormatada = `${Math.round(porcentagem * 100)}%`;
  
  // Definir classes com base no status
  const getStatusClass = () => {
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
        return 'bg-green-500';
    }
  };
  
  const getBadgeClass = () => {
    switch (status) {
      case 'baixo':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'médio':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'alto':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'excedido':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-green-100 text-green-800 hover:bg-green-100';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          {valorAtualFormatado} de {valorMetaFormatado}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{porcentagemFormatada}</span>
          <Badge variant="secondary" className={cn("font-normal", getBadgeClass())}>
            {status === 'excedido' ? 'Excedido' : 
              status === 'alto' ? 'Alto' : 
              status === 'médio' ? 'Médio' : 'Baixo'}
          </Badge>
        </div>
      </div>
      
      <Progress 
        value={porcentagemParaBarra} 
        className="h-2 bg-gray-100" 
        indicatorClassName={getStatusClass()}
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>0%</span>
        <span>{Math.round(LIMITE_BAIXO * 100)}%</span>
        <span>{Math.round(LIMITE_MEDIO * 100)}%</span>
        <span>{Math.round(LIMITE_ALTO * 100)}%</span>
      </div>
    </div>
  );
}
