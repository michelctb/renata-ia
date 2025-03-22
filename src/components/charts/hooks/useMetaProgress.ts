
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { MetaCategoria, LIMITE_BAIXO, LIMITE_MEDIO, LIMITE_ALTO } from '@/lib/metas';

export function useMetasProgress(
  metas: MetaCategoria[],
  filteredTransactions: Transaction[]
) {
  return useMemo(() => {
    if (!metas.length || !filteredTransactions.length) return [];
    
    return metas.map(meta => {
      // Filtrar transações apenas de saída e da categoria específica
      const gastosPorCategoria = filteredTransactions
        .filter(t => 
          t.operação?.toLowerCase() === 'saída' && 
          t.categoria === meta.categoria
        )
        .reduce((total, t) => total + (t.valor || 0), 0);
      
      // Calcular porcentagem
      const porcentagem = meta.valor_meta > 0 ? gastosPorCategoria / meta.valor_meta : 0;
      
      // Determinar status baseado na porcentagem
      let status: 'baixo' | 'médio' | 'alto' | 'excedido' = 'baixo';
      
      // Usando os limites com comparação >=
      if (porcentagem >= LIMITE_ALTO) {
        status = 'excedido';
      } else if (porcentagem >= LIMITE_MEDIO) {
        status = 'alto';
      } else if (porcentagem >= LIMITE_BAIXO) {
        status = 'médio';
      }
      
      console.log(`Dashboard - Meta ${meta.categoria}: ${gastosPorCategoria}/${meta.valor_meta} = ${porcentagem * 100}% (status: ${status})`);
      
      return {
        meta,
        valor_atual: gastosPorCategoria,
        porcentagem,
        status
      };
    })
    .sort((a, b) => b.porcentagem - a.porcentagem)
    .slice(0, 5); // Mostrar apenas as 5 metas com maior progresso
  }, [metas, filteredTransactions]);
}
